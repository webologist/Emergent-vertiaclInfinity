"""API regression tests for auth cookies, protected lead CRUD, CORS, and lockout."""

import asyncio
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

import bcrypt
import pytest
import requests
from dotenv import dotenv_values
from pymongo import MongoClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing")
BASE_URL = base_url.rstrip("/")
CREDENTIALS_FILE = Path("/app/memory/test_credentials.md")


def _load_admin_credentials():
    if not CREDENTIALS_FILE.exists():
        pytest.skip("Missing /app/memory/test_credentials.md")
    content = CREDENTIALS_FILE.read_text(encoding="utf-8")
    email_match = re.search(r"(?im)^\s*[-*]\s*Email:\s*([^\s]+)", content)
    password_match = re.search(r"(?im)^\s*[-*]\s*Password:\s*([^\s]+)", content)
    if not email_match or not password_match:
        pytest.skip("Admin email/password missing from test_credentials.md")
    return {"email": email_match.group(1), "password": password_match.group(1)}


@pytest.fixture(scope="session")
def admin_credentials():
    return _load_admin_credentials()


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    yield session
    session.close()


@pytest.fixture
def authenticated_client(admin_credentials):
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    response = session.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
    if response.status_code != 200:
        pytest.fail(f"Admin authentication failed: {response.status_code} {response.text[:300]}")
    yield session
    session.post(f"{BASE_URL}/api/auth/logout", timeout=20)
    session.close()


@pytest.fixture(scope="session")
def tracked_contact_ids():
    ids = []
    yield ids
    mongo_url = backend_env.get("MONGO_URL")
    db_name = backend_env.get("DB_NAME")
    if mongo_url and db_name and ids:
        mongo = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        mongo[db_name].contacts.delete_many({"id": {"$in": ids}})
        mongo.close()


def assert_user_shape(user, expected_email):
    assert isinstance(user.get("id"), str) and user["id"]
    uuid.UUID(user["id"])
    assert user["email"] == expected_email.lower()
    assert user["name"] == "Admin"
    assert user["role"] == "admin"
    assert "password" not in user and "password_hash" not in user and "_id" not in user


def assert_contact_shape(item):
    assert isinstance(item["id"], str) and item["id"]
    uuid.UUID(item["id"])
    assert isinstance(item["name"], str) and item["name"]
    assert isinstance(item["email"], str) and item["email"]
    assert isinstance(item["company"], str)
    assert isinstance(item["message"], str) and item["message"]
    assert isinstance(item["topic"], str) and item["topic"]
    assert datetime.fromisoformat(item["created_at"]).tzinfo is not None
    assert "_id" not in item


class TestHealthAndAuthProtection:
    """Health and unauthenticated access behavior."""

    def test_api_root(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/", timeout=20)
        assert response.status_code == 200
        assert response.json() == {"message": "Vertical Infinity API is live"}

    def test_me_without_cookies_is_401(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/auth/me", timeout=20)
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

    def test_contact_list_without_cookies_is_401(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/contact", timeout=20)
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

    def test_contact_delete_without_cookies_is_401(self, api_client):
        response = api_client.delete(f"{BASE_URL}/api/contact/{uuid.uuid4()}", timeout=20)
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}


class TestAuthentication:
    """Admin login, cookie attributes, refresh, logout, and bad password."""

    def test_login_sets_secure_httponly_cookies_and_returns_user(self, api_client, admin_credentials):
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
        assert response.status_code == 200, response.text
        assert_user_shape(response.json(), admin_credentials["email"])

        set_cookie = response.headers.get("set-cookie", "").lower()
        assert "access_token=" in set_cookie and "refresh_token=" in set_cookie
        assert set_cookie.count("httponly") >= 2
        assert set_cookie.count("secure") >= 2
        assert set_cookie.count("samesite=none") >= 2
        assert api_client.cookies.get("access_token")
        assert api_client.cookies.get("refresh_token")

    def test_me_with_login_cookies_returns_same_user(self, api_client, admin_credentials):
        login = api_client.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
        assert login.status_code == 200
        response = api_client.get(f"{BASE_URL}/api/auth/me", timeout=20)
        assert response.status_code == 200
        assert response.json() == login.json()
        assert_user_shape(response.json(), admin_credentials["email"])

    def test_refresh_issues_new_access_cookie(self, api_client, admin_credentials):
        login = api_client.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
        assert login.status_code == 200
        api_client.cookies.pop("access_token")
        assert not api_client.cookies.get("access_token")

        refresh = api_client.post(f"{BASE_URL}/api/auth/refresh", timeout=20)
        assert refresh.status_code == 200
        assert refresh.json() == {"ok": True}
        assert api_client.cookies.get("access_token")
        set_cookie = refresh.headers.get("set-cookie", "").lower()
        assert "access_token=" in set_cookie and "httponly" in set_cookie
        assert "secure" in set_cookie and "samesite=none" in set_cookie

        me = api_client.get(f"{BASE_URL}/api/auth/me", timeout=20)
        assert me.status_code == 200
        assert_user_shape(me.json(), admin_credentials["email"])

    def test_refresh_without_cookie_is_401(self, api_client):
        response = api_client.post(f"{BASE_URL}/api/auth/refresh", timeout=20)
        assert response.status_code == 401
        assert response.json() == {"detail": "Not authenticated"}

    def test_logout_clears_both_cookies_and_invalidates_session(self, api_client, admin_credentials):
        login = api_client.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
        assert login.status_code == 200
        response = api_client.post(f"{BASE_URL}/api/auth/logout", timeout=20)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        set_cookie = response.headers.get("set-cookie", "").lower()
        assert "access_token=" in set_cookie and "refresh_token=" in set_cookie
        assert set_cookie.count("max-age=0") >= 2
        assert not api_client.cookies.get("access_token")
        assert not api_client.cookies.get("refresh_token")
        me = api_client.get(f"{BASE_URL}/api/auth/me", timeout=20)
        assert me.status_code == 401

    def test_wrong_admin_password_is_401_then_valid_login_still_works(self, api_client, admin_credentials):
        bad = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": admin_credentials["email"], "password": "TEST_wrong_password"},
            timeout=20,
        )
        assert bad.status_code == 401
        assert bad.json() == {"detail": "Invalid email or password"}
        valid = api_client.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=20)
        assert valid.status_code == 200
        assert_user_shape(valid.json(), admin_credentials["email"])


class TestContactCRUD:
    """Public contact creation and authenticated list/delete persistence."""

    def test_public_create_list_delete_and_verify_persistence(
        self, api_client, authenticated_client, tracked_contact_ids
    ):
        marker = uuid.uuid4().hex[:10]
        payload = {
            "name": f"TEST_QA_{marker}",
            "email": f"test.qa.{marker}@example.com",
            "company": "TEST_Vertical QA",
            "message": "TEST_Lead inbox create/list/delete persistence verification.",
            "topic": "Automation",
        }
        created_response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        assert created_response.status_code == 200
        created = created_response.json()
        assert_contact_shape(created)
        tracked_contact_ids.append(created["id"])
        for field, value in payload.items():
            assert created[field] == value

        list_response = authenticated_client.get(f"{BASE_URL}/api/contact", timeout=20)
        assert list_response.status_code == 200
        items = list_response.json()
        assert isinstance(items, list)
        matches = [item for item in items if item["id"] == created["id"]]
        assert len(matches) == 1
        assert_contact_shape(matches[0])
        for field, value in payload.items():
            assert matches[0][field] == value

        delete_response = authenticated_client.delete(f"{BASE_URL}/api/contact/{created['id']}", timeout=20)
        assert delete_response.status_code == 200
        assert delete_response.json() == {"ok": True}
        tracked_contact_ids.remove(created["id"])

        after_delete = authenticated_client.get(f"{BASE_URL}/api/contact", timeout=20)
        assert after_delete.status_code == 200
        assert all(item["id"] != created["id"] for item in after_delete.json())

    def test_delete_unknown_contact_is_404(self, authenticated_client):
        unknown_id = str(uuid.uuid4())
        response = authenticated_client.delete(f"{BASE_URL}/api/contact/{unknown_id}", timeout=20)
        assert response.status_code == 404
        assert response.json() == {"detail": "Contact not found"}

    @pytest.mark.parametrize("field", ["name", "message"])
    def test_public_contact_rejects_whitespace_required_fields(self, api_client, field):
        payload = {
            "name": "TEST_Whitespace",
            "email": "test.whitespace@example.com",
            "company": "TEST_Company",
            "message": "TEST_Message",
            "topic": "General",
        }
        payload[field] = "   "
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        assert response.status_code == 422
        detail = response.json().get("detail")
        assert isinstance(detail, list) and any(error.get("loc", [])[-1:] == [field] for error in detail)

    @pytest.mark.parametrize(("field", "expected"), [("company", ""), ("topic", "General")])
    def test_public_contact_normalizes_nullable_optional_fields(
        self, api_client, authenticated_client, tracked_contact_ids, field, expected
    ):
        marker = uuid.uuid4().hex[:10]
        payload = {
            "name": f"TEST_Nullable_{marker}",
            "email": f"test.nullable.{marker}@example.com",
            "company": "TEST_Company",
            "message": "TEST_Message",
            "topic": "Automation",
        }
        payload[field] = None
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        assert response.status_code == 200, response.text
        created = response.json()
        tracked_contact_ids.append(created["id"])
        assert created[field] == expected
        delete_response = authenticated_client.delete(f"{BASE_URL}/api/contact/{created['id']}", timeout=20)
        assert delete_response.status_code == 200
        tracked_contact_ids.remove(created["id"])


class TestAuthStorageAndCORS:
    """Auth persistence/indexes and credentialed CORS policy."""

    def test_admin_hash_and_required_indexes(self, admin_credentials):
        mongo_url = backend_env.get("MONGO_URL")
        db_name = backend_env.get("DB_NAME")
        assert mongo_url and db_name
        mongo = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = mongo[db_name]
        admin = db.users.find_one({"email": admin_credentials["email"].lower()})
        assert admin is not None
        assert admin["password_hash"].startswith("$2b$")
        assert "_id" in admin and isinstance(admin["id"], str)
        user_indexes = db.users.index_information()
        login_indexes = db.login_attempts.index_information()
        assert any(index.get("unique") and index["key"] == [("email", 1)] for index in user_indexes.values())
        assert any(index["key"] == [("identifier", 1)] for index in login_indexes.values())
        mongo.close()

    def test_seed_admin_updates_existing_stale_password_hash(self):
        mongo_url = backend_env.get("MONGO_URL")
        db_name = backend_env.get("DB_NAME")
        assert mongo_url and db_name
        mongo = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = mongo[db_name]
        marker = uuid.uuid4().hex[:10]
        test_email = f"test_seed_admin_{marker}@example.com"
        test_id = str(uuid.uuid4())
        configured_password = f"TEST_Configured_{marker}!"
        stale_hash = bcrypt.hashpw(b"TEST_Stale_password!", bcrypt.gensalt()).decode("utf-8")
        old_admin_email = os.environ.get("ADMIN_EMAIL")
        old_admin_password = os.environ.get("ADMIN_PASSWORD")
        try:
            db.users.insert_one({
                "id": test_id,
                "email": test_email,
                "password_hash": stale_hash,
                "name": "TEST Existing Admin",
                "role": "admin",
                "created_at": datetime.now().astimezone().isoformat(),
            })
            os.environ["ADMIN_EMAIL"] = test_email
            os.environ["ADMIN_PASSWORD"] = configured_password
            if "/app/backend" not in sys.path:
                sys.path.insert(0, "/app/backend")
            import server

            asyncio.run(server.seed_admin())
            updated = db.users.find_one({"email": test_email})
            assert updated["id"] == test_id
            assert updated["password_hash"] != stale_hash
            assert updated["password_hash"].startswith("$2b$")
            assert bcrypt.checkpw(configured_password.encode("utf-8"), updated["password_hash"].encode("utf-8"))
        finally:
            if old_admin_email is None:
                os.environ.pop("ADMIN_EMAIL", None)
            else:
                os.environ["ADMIN_EMAIL"] = old_admin_email
            if old_admin_password is None:
                os.environ.pop("ADMIN_PASSWORD", None)
            else:
                os.environ["ADMIN_PASSWORD"] = old_admin_password
            db.users.delete_many({"email": test_email})
            mongo.close()

    def test_configured_frontend_origin_supports_credentialed_cors(self, api_client):
        response = api_client.options(
            f"{BASE_URL}/api/auth/login",
            headers={
                "Origin": BASE_URL,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
            timeout=20,
        )
        assert response.status_code in (200, 204)
        assert response.headers.get("access-control-allow-origin") == BASE_URL
        assert response.headers.get("access-control-allow-credentials") == "true"

    def test_unknown_origin_is_not_allowed_for_credentialed_cors(self, api_client):
        malicious_origin = "https://malicious-origin.example"
        response = api_client.options(
            f"{BASE_URL}/api/auth/login",
            headers={
                "Origin": malicious_origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
            timeout=20,
        )
        assert response.headers.get("access-control-allow-origin") != malicious_origin


class TestBruteForceLockoutLast:
    """Run last: five fake-account failures cause subsequent requests to be rate limited."""

    def test_five_failed_attempts_trigger_429_lockout(self, api_client):
        email = "lockme@test.com"
        mongo_url = backend_env.get("MONGO_URL")
        db_name = backend_env.get("DB_NAME")
        mongo = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = mongo[db_name]
        try:
            db.login_attempts.delete_many({"identifier": {"$regex": f":{re.escape(email)}$"}})
            for attempt_number in range(1, 6):
                response = api_client.post(
                    f"{BASE_URL}/api/auth/login",
                    json={"email": email, "password": f"TEST_bad_{attempt_number}"},
                    timeout=20,
                )
                assert response.status_code == 401, f"attempt {attempt_number}: {response.text}"
                assert response.json() == {"detail": "Invalid email or password"}
            locked = api_client.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": email, "password": "TEST_bad_6"},
                timeout=20,
            )
            assert locked.status_code == 429
            assert locked.json() == {"detail": "Too many failed attempts. Try again in 15 minutes."}
        finally:
            db.login_attempts.delete_many({"identifier": {"$regex": f":{re.escape(email)}$"}})
            mongo.close()

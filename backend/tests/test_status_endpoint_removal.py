"""Security-fix verification: /api/status removal + regressions for contact, auth, status PATCH, reviews."""

import os
import re
from pathlib import Path

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing from env and /app/frontend/.env")
BASE_URL = base_url.rstrip("/")
CREDENTIALS_FILE = Path("/app/memory/test_credentials.md")


def _load_admin_credentials():
    if not CREDENTIALS_FILE.exists():
        pytest.skip("Missing /app/memory/test_credentials.md")
    content = CREDENTIALS_FILE.read_text(encoding="utf-8")
    email = re.search(r"(?im)^\s*[-*]\s*Email:\s*([^\s]+)", content)
    password = re.search(r"(?im)^\s*[-*]\s*Password:\s*([^\s]+)", content)
    if not email or not password:
        pytest.skip("No admin email/password found in test_credentials.md")
    return {"email": email.group(1), "password": password.group(1)}


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_credentials():
    return _load_admin_credentials()


@pytest.fixture(scope="module")
def authenticated_client(admin_credentials):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=30)
    if r.status_code != 200:
        pytest.fail(f"Admin login failed: {r.status_code} {r.text[:300]}")
    assert "access_token" in s.cookies, "access_token cookie not set on login"
    yield s
    s.post(f"{BASE_URL}/api/auth/logout", timeout=30)


@pytest.fixture(scope="module")
def created_contact_ids():
    return []


@pytest.fixture(scope="module", autouse=True)
def cleanup(authenticated_client, created_contact_ids):
    yield
    for cid in created_contact_ids:
        authenticated_client.delete(f"{BASE_URL}/api/contact/{cid}", timeout=30)


# --- SECURITY FIX: /api/status endpoints removed ---
class TestStatusEndpointRemoved:
    def test_get_status_is_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/status", timeout=30)
        assert r.status_code == 404, f"expected 404, got {r.status_code}: {r.text[:200]}"

    def test_post_status_is_404(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/status", json={"client_name": "TEST_probe"}, timeout=30)
        assert r.status_code in (404, 405), f"expected 404/405, got {r.status_code}: {r.text[:200]}"

    def test_get_status_with_trailing_slash_is_404(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/status/", timeout=30)
        assert r.status_code == 404

    def test_openapi_no_longer_exposes_status_route(self, api_client):
        r = api_client.get(f"{BASE_URL}/openapi.json", timeout=30)
        if r.status_code != 200 or "application/json" not in r.headers.get("content-type", ""):
            # ingress routes non-/api paths to the frontend; fall back to the internal app schema
            r = requests.get("http://localhost:8001/openapi.json", timeout=30)
            assert r.status_code == 200, f"openapi unavailable: {r.status_code}"
        paths = r.json().get("paths", {})
        assert "/api/status" not in paths, f"/api/status still in OpenAPI schema: {list(paths)}"
        assert "/api/contact/{contact_id}/status" in paths

    def test_root_still_alive(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=30)
        assert r.status_code == 200


# --- REGRESSION: contact creation + validation ---
class TestContactRegression:
    def test_create_contact_persists_status_new(self, api_client, authenticated_client, created_contact_ids):
        payload = {
            "name": "TEST_Status Removal",
            "email": "test_status_removal@example.com",
            "company": "TEST_Co",
            "message": "TEST regression after /api/status removal",
            "topic": "Fabrication",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=60)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:300]}"
        data = r.json()
        assert data["status"] == "new"
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["company"] == payload["company"]
        assert data["topic"] == payload["topic"]
        assert isinstance(data["id"], str) and data["id"]
        assert "_id" not in data
        created_contact_ids.append(data["id"])

        listed = authenticated_client.get(f"{BASE_URL}/api/contact", timeout=30)
        assert listed.status_code == 200
        leads = listed.json()
        assert isinstance(leads, list)
        match = [x for x in leads if x["id"] == data["id"]]
        assert match, "newly created lead not present in authenticated leads list"
        assert match[0]["status"] == "new"
        assert match[0]["message"] == payload["message"]

    def test_whitespace_name_is_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "   ", "email": "test_ws@example.com", "message": "TEST body"}, timeout=30)
        assert r.status_code == 422, f"{r.status_code}: {r.text[:200]}"

    def test_invalid_email_is_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_x", "email": "not-an-email", "message": "TEST body"}, timeout=30)
        assert r.status_code == 422, f"{r.status_code}: {r.text[:200]}"


# --- REGRESSION: protected PATCH /api/contact/{id}/status ---
class TestContactStatusPatch:
    @pytest.fixture(scope="class")
    def lead_id(self, api_client, created_contact_ids):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_Patch Target",
            "email": "test_patch_target@example.com",
            "message": "TEST patch status regression",
        }, timeout=60)
        assert r.status_code == 200, r.text[:300]
        cid = r.json()["id"]
        created_contact_ids.append(cid)
        return cid

    def test_patch_status_unauthenticated_is_401(self, api_client, lead_id):
        r = api_client.patch(f"{BASE_URL}/api/contact/{lead_id}/status",
                             json={"status": "contacted"}, timeout=30)
        assert r.status_code == 401, f"{r.status_code}: {r.text[:200]}"

    @pytest.mark.parametrize("new_status", ["contacted", "closed", "new"])
    def test_patch_valid_status_persists(self, authenticated_client, lead_id, new_status):
        r = authenticated_client.patch(f"{BASE_URL}/api/contact/{lead_id}/status",
                                       json={"status": new_status}, timeout=30)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:300]}"
        assert r.json()["status"] == new_status
        assert "_id" not in r.json()

        leads = authenticated_client.get(f"{BASE_URL}/api/contact", timeout=30).json()
        found = [x for x in leads if x["id"] == lead_id]
        assert found and found[0]["status"] == new_status, "status change not persisted"

    def test_patch_invalid_status_is_422(self, authenticated_client, lead_id):
        r = authenticated_client.patch(f"{BASE_URL}/api/contact/{lead_id}/status",
                                       json={"status": "archived"}, timeout=30)
        assert r.status_code == 422, f"{r.status_code}: {r.text[:200]}"

    def test_patch_unknown_lead_is_404(self, authenticated_client):
        r = authenticated_client.patch(f"{BASE_URL}/api/contact/does-not-exist-123/status",
                                       json={"status": "closed"}, timeout=30)
        assert r.status_code == 404, f"{r.status_code}: {r.text[:200]}"


# --- REGRESSION: auth + reviews ---
class TestAuthAndReviews:
    def test_leads_list_unauthenticated_is_401(self, api_client):
        r = requests.get(f"{BASE_URL}/api/contact", timeout=30)
        assert r.status_code == 401

    def test_login_returns_user_and_cookies(self, admin_credentials):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login", json=admin_credentials, timeout=30)
        assert r.status_code == 200, r.text[:300]
        body = r.json()
        assert body["email"] == admin_credentials["email"].lower()
        assert body["role"] == "admin"
        assert "access_token" in s.cookies and "refresh_token" in s.cookies
        set_cookie = r.headers.get("set-cookie", "").lower()
        assert "httponly" in set_cookie
        me = s.get(f"{BASE_URL}/api/auth/me", timeout=30)
        assert me.status_code == 200 and me.json()["id"] == body["id"]
        s.post(f"{BASE_URL}/api/auth/logout", timeout=30)

    def test_reviews_returns_aggregate(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/reviews", timeout=60)
        assert r.status_code == 200, f"{r.status_code}: {r.text[:300]}"
        data = r.json()
        assert "rating" in data and "review_count" in data, data
        assert isinstance(data["rating"], (int, float)) and 0 <= data["rating"] <= 5
        assert isinstance(data["review_count"], int) and data["review_count"] >= 0
        assert isinstance(data.get("live"), bool)

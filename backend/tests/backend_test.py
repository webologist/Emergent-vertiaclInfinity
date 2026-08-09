"""Public API regression tests for health, contact submissions, validation, and status checks."""

import os
import uuid
from datetime import datetime
from pathlib import Path

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


@pytest.fixture(scope="session")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    session.timeout = 20
    yield session
    session.close()


@pytest.fixture(scope="session")
def created_ids():
    tracked = {"contact": [], "status": []}
    yield tracked

    mongo_url = backend_env.get("MONGO_URL")
    db_name = backend_env.get("DB_NAME")
    if not mongo_url or not db_name:
        return
    mongo = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    db = mongo[db_name]
    if tracked["contact"]:
        db.contacts.delete_many({"id": {"$in": tracked["contact"]}})
    if tracked["status"]:
        db.status_checks.delete_many({"id": {"$in": tracked["status"]}})
    mongo.close()


def assert_contact_shape(item):
    assert isinstance(item["id"], str) and item["id"]
    uuid.UUID(item["id"])
    assert isinstance(item["name"], str)
    assert isinstance(item["email"], str)
    assert isinstance(item["company"], str)
    assert isinstance(item["message"], str)
    assert isinstance(item["topic"], str)
    created_at = datetime.fromisoformat(item["created_at"])
    assert created_at.tzinfo is not None


class TestHealth:
    def test_api_root(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/", timeout=20)
        assert response.status_code == 200
        assert response.json() == {"message": "Vertical Infinity API is live"}


class TestContact:
    def test_list_contacts(self, api_client):
        response = api_client.get(f"{BASE_URL}/api/contact", timeout=20)
        assert response.status_code == 200
        items = response.json()
        assert isinstance(items, list)
        for item in items:
            assert_contact_shape(item)

    def test_create_contact_and_verify_persistence(self, api_client, created_ids):
        marker = uuid.uuid4().hex[:10]
        payload = {
            "name": f"TEST_QA_{marker}",
            "email": f"test.qa.{marker}@example.com",
            "company": "TEST_Vertical QA",
            "message": "TEST_Contact submission persistence verification.",
            "topic": "Automation",
        }
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        assert response.status_code == 200
        item = response.json()
        assert_contact_shape(item)
        created_ids["contact"].append(item["id"])
        for field, value in payload.items():
            assert item[field] == value

        list_response = api_client.get(f"{BASE_URL}/api/contact", timeout=20)
        assert list_response.status_code == 200
        matches = [entry for entry in list_response.json() if entry["id"] == item["id"]]
        assert len(matches) == 1
        for field, value in payload.items():
            assert matches[0][field] == value

    def test_invalid_email_returns_validation_detail(self, api_client):
        response = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": "TEST_Invalid", "email": "not-an-email", "company": "", "message": "TEST_Message", "topic": "General"},
            timeout=20,
        )
        assert response.status_code == 422
        detail = response.json().get("detail")
        assert isinstance(detail, list) and detail
        assert any(error.get("loc", [])[-1:] == ["email"] for error in detail)

    @pytest.mark.parametrize(
        ("field", "value"),
        [
            ("name", "x" * 121),
            ("company", "x" * 161),
            ("message", "x" * 4001),
            ("topic", "x" * 81),
        ],
    )
    def test_field_length_limits(self, api_client, field, value):
        payload = {
            "name": "TEST_Length",
            "email": "test.length@example.com",
            "company": "TEST_Company",
            "message": "TEST_Message",
            "topic": "General",
        }
        payload[field] = value
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        assert response.status_code == 422
        detail = response.json().get("detail")
        assert isinstance(detail, list) and any(error.get("loc", [])[-1:] == [field] for error in detail)

    @pytest.mark.parametrize("field", ["name", "message"])
    def test_required_text_rejects_whitespace_only(self, api_client, created_ids, field):
        payload = {
            "name": "TEST_Whitespace",
            "email": "test.whitespace@example.com",
            "company": "TEST_Company",
            "message": "TEST_Message",
            "topic": "General",
        }
        payload[field] = "   "
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        if response.status_code == 200:
            created_ids["contact"].append(response.json()["id"])
        assert response.status_code == 422

    @pytest.mark.parametrize("field", ["company", "topic"])
    def test_nullable_optional_fields_do_not_cause_server_error(self, api_client, created_ids, field):
        payload = {
            "name": "TEST_Nullable",
            "email": "test.nullable@example.com",
            "company": "TEST_Company",
            "message": "TEST_Message",
            "topic": "General",
        }
        payload[field] = None
        response = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
        if response.status_code == 200:
            created_ids["contact"].append(response.json()["id"])
        assert response.status_code in (200, 422), response.text


class TestStatus:
    def test_create_status_and_verify_persistence(self, api_client, created_ids):
        client_name = f"TEST_QA_{uuid.uuid4().hex[:10]}"
        create_response = api_client.post(f"{BASE_URL}/api/status", json={"client_name": client_name}, timeout=20)
        assert create_response.status_code == 200
        created = create_response.json()
        assert created["client_name"] == client_name
        assert isinstance(created["id"], str)
        uuid.UUID(created["id"])
        assert datetime.fromisoformat(created["timestamp"]).tzinfo is not None
        created_ids["status"].append(created["id"])

        get_response = api_client.get(f"{BASE_URL}/api/status", timeout=20)
        assert get_response.status_code == 200
        matches = [entry for entry in get_response.json() if entry["id"] == created["id"]]
        assert len(matches) == 1
        assert matches[0]["client_name"] == client_name

"""
Backend regression tests:
1. GET /api/reviews - verifies 200 (never 502) after HTTPException fix in except clause
2. CORS sanity check on /api/* endpoints
3. Auth flow: login, /me, protected /api/contact (401 without auth, 200 with auth)
4. General health check of /api/ root
"""
import os
import pytest
import requests
from dotenv import dotenv_values

_frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or _frontend_env.get('REACT_APP_BACKEND_URL', '')).rstrip('/')
ADMIN_EMAIL = "admin@verticalinfinity.in"
ADMIN_PASSWORD = "VInfinity!2026"


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestReviewsEndpoint:
    def test_reviews_returns_200_not_502(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/reviews")
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert "live" in data
        assert "rating" in data
        assert "reviews" in data
        assert isinstance(data["reviews"], list)
        assert "google_maps_uri" in data
        assert "write_review_uri" in data

    def test_reviews_multiple_calls_stable(self, api_client):
        # Fire multiple requests to check for intermittent 502s
        statuses = []
        for _ in range(5):
            resp = api_client.get(f"{BASE_URL}/api/reviews")
            statuses.append(resp.status_code)
        assert all(s == 200 for s in statuses), f"Got statuses: {statuses}"


class TestCORS:
    def test_options_preflight(self, api_client):
        resp = api_client.options(
            f"{BASE_URL}/api/reviews",
            headers={
                "Origin": "https://clean-tech-hero.emergent.host",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert resp.status_code in (200, 204)

    def test_get_has_cors_headers(self, api_client):
        resp = api_client.get(
            f"{BASE_URL}/api/reviews",
            headers={"Origin": "https://clean-tech-hero.emergent.host"},
        )
        assert resp.status_code == 200
        assert "access-control-allow-origin" in {k.lower() for k in resp.headers.keys()}


class TestAuthFlow:
    def test_contact_requires_auth(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/contact")
        assert resp.status_code == 401

    def test_login_success_and_me_and_contact(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })
        assert resp.status_code == 200, f"Login failed: {resp.status_code} {resp.text}"
        data = resp.json()
        assert data.get("email") == ADMIN_EMAIL
        assert data.get("role") == "admin"

        # cookies should be set
        cookie_names = {c.name for c in api_client.cookies}
        assert "access_token" in cookie_names
        assert "refresh_token" in cookie_names

        # /me should work
        me_resp = api_client.get(f"{BASE_URL}/api/auth/me")
        assert me_resp.status_code == 200
        assert me_resp.json().get("email") == ADMIN_EMAIL

        # /api/contact should now be accessible
        contact_resp = api_client.get(f"{BASE_URL}/api/contact")
        assert contact_resp.status_code == 200
        assert isinstance(contact_resp.json(), list)

    def test_login_invalid_credentials(self, api_client):
        resp = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123",
        })
        assert resp.status_code == 401


class TestHealth:
    def test_root(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/")
        assert resp.status_code == 200

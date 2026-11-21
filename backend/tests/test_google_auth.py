"""Backend tests: Google session endpoint + auth regression (iteration 9)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback for local runs — read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

from dotenv import dotenv_values
_backend_env = dotenv_values("/app/backend/.env")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or _backend_env["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD") or _backend_env["ADMIN_PASSWORD"]


@pytest.fixture
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Google session endpoint ----------

class TestGoogleSession:
    def test_invalid_session_id_returns_401(self, s):
        r = s.post(f"{BASE_URL}/api/auth/google/session", json={"session_id": "bogus"})
        assert r.status_code == 401, r.text
        data = r.json()
        assert data.get("detail") == "Invalid or expired sign-in session"

    def test_missing_session_id_returns_422(self, s):
        r = s.post(f"{BASE_URL}/api/auth/google/session", json={})
        assert r.status_code == 422, r.text

    def test_empty_session_id_returns_422(self, s):
        r = s.post(f"{BASE_URL}/api/auth/google/session", json={"session_id": ""})
        assert r.status_code == 422, r.text


# ---------- Password login regression + protected endpoints ----------

class TestPasswordLoginRegression:
    def test_login_success_sets_cookies(self, s):
        r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"
        cookies = {c.name: c for c in s.cookies}
        assert "access_token" in cookies
        assert "refresh_token" in cookies
        # httpOnly assertion (requests exposes via _rest)
        for name in ("access_token", "refresh_token"):
            c = cookies[name]
            rest = getattr(c, "_rest", {}) or {}
            # normalize keys to lowercase
            keys = {k.lower() for k in rest.keys()}
            assert "httponly" in keys, f"{name} cookie missing HttpOnly"

    def test_me_with_cookies(self, s):
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200, r.text
        assert r.json()["email"] == ADMIN_EMAIL

    def test_refresh_ok(self, s):
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.post(f"{BASE_URL}/api/auth/refresh")
        assert r.status_code == 200, r.text

    def test_logout_clears_cookies(self, s):
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.post(f"{BASE_URL}/api/auth/logout")
        assert r.status_code in (200, 204), r.text
        # After logout, /api/auth/me should fail
        me = s.get(f"{BASE_URL}/api/auth/me")
        assert me.status_code == 401

    def test_wrong_password_401(self):
        # Use fresh session so no lockout from prior tests
        sess = requests.Session()
        sess.headers.update({"Content-Type": "application/json"})
        # Use non-existent email to avoid triggering lockout on admin account
        r = sess.post(f"{BASE_URL}/api/auth/login", json={"email": "nobody-xyz@verticalinfinity.in", "password": "wrong"})
        assert r.status_code == 401, r.text


class TestProtectedEndpoints:
    def test_contact_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 401

    def test_finder_insights_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/finder/insights")
        assert r.status_code == 401

    def test_contact_with_auth(self, s):
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200, r.text
        assert isinstance(r.json(), list)

    def test_finder_insights_with_auth(self, s):
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.get(f"{BASE_URL}/api/finder/insights")
        assert r.status_code == 200, r.text

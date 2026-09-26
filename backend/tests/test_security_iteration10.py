"""Iteration 10 security tests: headers, rotated admin password, spoof-resistant rate limit,
login lockout, require_admin gating, google session unchanged."""
import os
import time
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Load frontend .env for public URL
load_dotenv(Path("/app/frontend/.env"))
load_dotenv(Path("/app/backend/.env"))

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].strip('"')
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"].strip('"')
OLD_PASSWORD = "VInfinity!2026"

MONGO_URL = os.environ["MONGO_URL"].strip('"')
DB_NAME = os.environ["DB_NAME"].strip('"')

mongo = MongoClient(MONGO_URL)
db = mongo[DB_NAME]


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---- Security headers ----
def test_security_headers_present():
    r = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    h = {k.lower(): v for k, v in r.headers.items()}
    assert h.get("x-content-type-options") == "nosniff"
    assert h.get("x-frame-options") == "DENY"
    assert "referrer-policy" in h
    assert "strict-transport-security" in h
    assert "permissions-policy" in h


# ---- Rotated admin password ----
def test_new_admin_password_works():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200
    # cookies set
    cookies = r.cookies
    assert "access_token" in cookies
    assert "refresh_token" in cookies


def test_old_admin_password_rejected():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": OLD_PASSWORD}, timeout=15)
    assert r.status_code == 401
    # Cleanup potential login_attempts row for this ip|email so lockout test is fresh
    try:
        db.login_attempts.delete_many({"identifier": {"$regex": f".*\\|{ADMIN_EMAIL}$"}})
    except Exception:
        pass


# ---- Protected endpoint gating ----
@pytest.mark.parametrize("path", [
    "/api/auth/me",
    "/api/contact",
    "/api/finder/insights",
    "/api/admin/access",
])
def test_protected_requires_auth(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=15)
    assert r.status_code == 401, f"{path} expected 401 got {r.status_code}"


@pytest.mark.parametrize("path", [
    "/api/auth/me",
    "/api/contact",
    "/api/finder/insights",
    "/api/admin/access",
])
def test_protected_ok_with_admin(admin_session, path):
    r = admin_session.get(f"{BASE_URL}{path}", timeout=15)
    assert r.status_code == 200, f"{path} expected 200 got {r.status_code}: {r.text[:200]}"


# ---- Rate-limit spoof resistance ----
def test_rate_limit_uses_rightmost_xff(admin_session):
    """5 posts share the same rightmost hop 10.9.9.9 (real IP) so 6th is rate-limited,
    despite different leftmost spoofed IPs."""
    # Cleanup: clear any prior contact_rate rows for 10.9.9.9
    db.contact_rate.delete_many({"ip": "10.9.9.9"})

    created_ids = []
    statuses = []
    for i in range(6):
        r = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "name": f"TEST_spoof_{i}",
                "email": f"test_spoof_{i}@example.com",
                "message": "TEST rate limit spoof",
                "topic": "General",
            },
            headers={"X-Forwarded-For": f"1.2.3.{i}, 10.9.9.9"},
            timeout=15,
        )
        statuses.append(r.status_code)
        if r.status_code == 200:
            try:
                created_ids.append(r.json().get("id"))
            except Exception:
                pass

    print(f"Statuses: {statuses}")
    # first 5 should be 200
    assert statuses[:5] == [200, 200, 200, 200, 200], f"Expected first 5 to be 200 got {statuses}"
    assert statuses[5] == 429, f"Expected 6th to be 429 got {statuses[5]}"

    # Cleanup created leads
    for cid in created_ids:
        try:
            admin_session.delete(f"{BASE_URL}/api/contact/{cid}", timeout=10)
        except Exception:
            pass
    # Clear the contact_rate rows so subsequent tests are unaffected
    db.contact_rate.delete_many({"ip": "10.9.9.9"})


# ---- Login lockout ----
def test_login_lockout_ip_email():
    email = ADMIN_EMAIL
    # Ensure clean state
    db.login_attempts.delete_many({"identifier": {"$regex": f".*\\|{email}$"}})

    statuses = []
    for i in range(6):
        r = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": f"wrong_{i}"},
            timeout=15,
        )
        statuses.append(r.status_code)

    print(f"Login lockout statuses: {statuses}")
    assert statuses[:5] == [401, 401, 401, 401, 401], f"Expected first 5 to be 401 got {statuses}"
    assert statuses[5] == 429, f"Expected 6th to be 429 got {statuses[5]}"

    # Cleanup
    db.login_attempts.delete_many({"identifier": {"$regex": f".*\\|{email}$"}})


# ---- Google session unchanged ----
def test_google_session_bogus_401():
    r = requests.post(f"{BASE_URL}/api/auth/google/session",
                      json={"session_id": "bogus_iter10"}, timeout=15)
    assert r.status_code == 401

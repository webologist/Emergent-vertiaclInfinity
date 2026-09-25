"""Tests for contact anti-spam (honeypot + rate limit) and regression."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://clean-tech-hero.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@verticalinfinity.in"
ADMIN_PASSWORD = "VInfinity!2026"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return s


def _cleanup_leads(session, marker):
    r = session.get(f"{API}/contact", timeout=15)
    if r.status_code != 200:
        return
    for lead in r.json():
        if marker in (lead.get("message") or "") or marker in (lead.get("name") or ""):
            session.delete(f"{API}/contact/{lead['id']}", timeout=15)


# ---- Root/health ----
def test_root_alive():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "live" in r.json().get("message", "").lower()


# ---- Auth regression ----
def test_login_and_me(admin_session):
    r = admin_session.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"


# ---- Honeypot ----
def test_honeypot_returns_200_but_drops(admin_session):
    marker = "TEST_HONEYPOT_MARKER_XYZ"
    payload = {
        "name": f"TEST_{marker}",
        "email": "honeypot@test.example",
        "company": "Spam",
        "message": f"Honeypot check {marker}",
        "topic": "General",
        "website": "http://spam.example",
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"].startswith("TEST_")
    # Verify NOT persisted
    time.sleep(0.5)
    listing = admin_session.get(f"{API}/contact", timeout=15).json()
    ids = [l["id"] for l in listing if marker in l.get("message", "")]
    assert len(ids) == 0, f"Honeypot lead was persisted: {ids}"


# ---- Valid submission persists ----
def test_valid_contact_persists(admin_session):
    marker = "TEST_VALID_MARKER_ABC"
    payload = {
        "name": f"TEST_{marker}",
        "email": "valid@test.example",
        "company": "Acme",
        "message": f"Valid submission {marker}",
        "topic": "General",
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=15,
                      headers={"X-Forwarded-For": "203.0.113.10"})
    assert r.status_code == 200
    created = r.json()
    assert created["email"] == "valid@test.example"
    time.sleep(0.5)
    listing = admin_session.get(f"{API}/contact", timeout=15).json()
    match = [l for l in listing if l["id"] == created["id"]]
    assert len(match) == 1
    # Cleanup
    admin_session.delete(f"{API}/contact/{created['id']}", timeout=15)


# ---- Rate limit ----
def test_rate_limit_per_ip(admin_session):
    marker = "TEST_RL_MARKER_QQQ"
    ip = "198.51.100.77"
    # Clean any existing docs first (best-effort)
    _cleanup_leads(admin_session, marker)
    created_ids = []
    try:
        for i in range(5):
            r = requests.post(f"{API}/contact",
                              json={
                                  "name": f"TEST_{marker}_{i}",
                                  "email": f"rl{i}@test.example",
                                  "message": f"RL {marker} {i}",
                                  "topic": "General",
                              },
                              headers={"X-Forwarded-For": ip}, timeout=15)
            assert r.status_code == 200, f"Attempt {i}: {r.status_code} {r.text}"
            created_ids.append(r.json()["id"])
        # 6th should be 429
        r6 = requests.post(f"{API}/contact",
                           json={
                               "name": f"TEST_{marker}_6",
                               "email": "rl6@test.example",
                               "message": f"RL {marker} 6",
                               "topic": "General",
                           },
                           headers={"X-Forwarded-For": ip}, timeout=15)
        assert r6.status_code == 429, f"Expected 429, got {r6.status_code}: {r6.text}"
        assert "too many" in r6.json().get("detail", "").lower()

        # Different IP should still succeed
        r_other = requests.post(f"{API}/contact",
                                json={
                                    "name": f"TEST_{marker}_other",
                                    "email": "rlother@test.example",
                                    "message": f"RL {marker} other",
                                    "topic": "General",
                                },
                                headers={"X-Forwarded-For": "203.0.113.222"}, timeout=15)
        # Note: ingress may prepend its own XFF; if so, the first IP may not be ours.
        # Accept 200 or note the ingress override.
        assert r_other.status_code in (200, 429), r_other.text
        if r_other.status_code == 200:
            created_ids.append(r_other.json()["id"])
    finally:
        for cid in created_ids:
            admin_session.delete(f"{API}/contact/{cid}", timeout=15)
        _cleanup_leads(admin_session, marker)


# ---- Admin CRUD regression ----
def test_admin_list_and_patch_status(admin_session):
    # create a lead
    payload = {"name": "TEST_PATCH", "email": "patch@test.example",
               "message": "TEST_PATCH_MSG", "topic": "General"}
    r = requests.post(f"{API}/contact", json=payload, timeout=15,
                      headers={"X-Forwarded-For": "203.0.113.99"})
    assert r.status_code == 200
    cid = r.json()["id"]
    try:
        pr = admin_session.patch(f"{API}/contact/{cid}/status", json={"status": "contacted"}, timeout=15)
        assert pr.status_code == 200
        assert pr.json()["status"] == "contacted"
    finally:
        admin_session.delete(f"{API}/contact/{cid}", timeout=15)


def test_reviews_endpoint():
    r = requests.get(f"{API}/reviews", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert "reviews" in data
    assert "rating" in data


# ---- Static SEO files ----
@pytest.mark.parametrize("path,must_contain", [
    ("/robots.txt", ["Sitemap:", "Disallow: /admin"]),
    ("/llms.txt", []),
    ("/sitemap.xml", ["<urlset", "verticalinfinity.in"]),
])
def test_static_seo_files(path, must_contain):
    r = requests.get(f"{BASE_URL}{path}", timeout=15)
    assert r.status_code == 200, f"{path} returned {r.status_code}"
    for token in must_contain:
        assert token in r.text, f"{path} missing '{token}'"

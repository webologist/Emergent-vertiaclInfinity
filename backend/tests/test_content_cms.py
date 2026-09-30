"""CMS content overrides endpoint tests (iteration 11)."""
import os
from dotenv import dotenv_values
_backend_env = dotenv_values("/app/backend/.env")
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback to frontend .env
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or _backend_env["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD") or _backend_env["ADMIN_PASSWORD"]

TEST_KEY = "hero.sub"  # real key used by frontend but we clean up


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_get_content_public():
    r = requests.get(f"{BASE_URL}/api/content", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), dict)


def test_put_content_unauth():
    r = requests.put(f"{BASE_URL}/api/content/{TEST_KEY}",
                     json={"value": "<p>x</p>"}, timeout=15)
    assert r.status_code == 401


def test_put_content_sanitize_and_persist(admin_session):
    dirty = ('<p>Hi <strong>there</strong>'
             '<script>x</script>'
             '<img src=x onerror=1>'
             '<a href="javascript:alert(1)">l</a></p>')
    r = admin_session.put(f"{BASE_URL}/api/content/{TEST_KEY}",
                          json={"value": dirty}, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    v = data["value"]
    assert "<script" not in v.lower()
    assert "<img" not in v.lower()
    assert "javascript:" not in v.lower()
    assert "<strong>there</strong>" in v

    # GET should contain the key
    g = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
    assert TEST_KEY in g
    assert g[TEST_KEY] == v


def test_delete_content(admin_session):
    r = admin_session.delete(f"{BASE_URL}/api/content/{TEST_KEY}", timeout=15)
    assert r.status_code == 200
    g = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
    assert TEST_KEY not in g


def test_invalid_key_rejected(admin_session):
    r = admin_session.put(f"{BASE_URL}/api/content/bad key!",
                          json={"value": "<p>x</p>"}, timeout=15)
    # Could be 422 (validation) or 404 (route mismatch on space)
    # The space in URL might get encoded; test the actual invalid pattern
    assert r.status_code in (404, 422), f"got {r.status_code}: {r.text}"


def test_invalid_key_with_special_chars(admin_session):
    # Use a key with `!` which is invalid per regex but valid URL segment
    r = admin_session.put(f"{BASE_URL}/api/content/bad!key",
                          json={"value": "<p>x</p>"}, timeout=15)
    assert r.status_code == 422


def test_value_too_long(admin_session):
    huge = "a" * 20001
    r = admin_session.put(f"{BASE_URL}/api/content/{TEST_KEY}",
                          json={"value": huge}, timeout=15)
    assert r.status_code == 422
    # cleanup just in case (should not have been stored)
    admin_session.delete(f"{BASE_URL}/api/content/{TEST_KEY}", timeout=15)


def test_cleanup_final():
    """Ensure no test overrides remain."""
    g = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
    # login and cleanup any TEST leftover
    s = requests.Session()
    s.post(f"{BASE_URL}/api/auth/login",
           json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    for k in list(g.keys()):
        s.delete(f"{BASE_URL}/api/content/{k}", timeout=15)
    final = requests.get(f"{BASE_URL}/api/content", timeout=15).json()
    assert final == {}

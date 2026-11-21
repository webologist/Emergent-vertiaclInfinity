"""Iteration 12 — Image upload endpoints (/api/uploads/image, /api/files/{id})."""
import os
from dotenv import dotenv_values
_backend_env = dotenv_values("/app/backend/.env")
import uuid
import hashlib
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or (
    open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
)
BASE_URL = BASE_URL.rstrip("/")

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or _backend_env["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD") or _backend_env["ADMIN_PASSWORD"]
LOGO_PATH = "/app/frontend/public/vi-logo.png"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text[:200]}"
    return s


def test_upload_unauth_returns_401():
    r = requests.post(f"{BASE_URL}/api/uploads/image", files={"file": ("x.png", b"\x89PNG\r\n", "image/png")}, timeout=15)
    assert r.status_code == 401, f"expected 401 got {r.status_code}"


def test_upload_wrong_content_type_returns_415(admin_session):
    r = admin_session.post(
        f"{BASE_URL}/api/uploads/image",
        files={"file": ("note.txt", b"hello world", "text/plain")},
        timeout=15,
    )
    assert r.status_code == 415, f"expected 415 got {r.status_code} {r.text[:200]}"


def test_upload_png_and_fetch(admin_session):
    with open(LOGO_PATH, "rb") as f:
        src_bytes = f.read()
    src_hash = hashlib.sha256(src_bytes).hexdigest()

    r = admin_session.post(
        f"{BASE_URL}/api/uploads/image",
        files={"file": ("vi-logo.png", src_bytes, "image/png")},
        timeout=60,
    )
    assert r.status_code == 201, f"upload failed: {r.status_code} {r.text[:300]}"
    body = r.json()
    assert "id" in body and "url" in body
    assert body["url"] == f"/api/files/{body['id']}"

    # Fetch the file
    g = requests.get(f"{BASE_URL}{body['url']}", timeout=60)
    assert g.status_code == 200, f"fetch failed: {g.status_code}"
    assert g.headers.get("content-type", "").startswith("image/png")
    got_hash = hashlib.sha256(g.content).hexdigest()
    assert got_hash == src_hash, "downloaded bytes differ from source"

    # stash for downstream if needed
    pytest.uploaded_file_id = body["id"]


def test_get_random_file_id_returns_404():
    rid = str(uuid.uuid4())
    r = requests.get(f"{BASE_URL}/api/files/{rid}", timeout=15)
    assert r.status_code == 404, f"expected 404 got {r.status_code}"

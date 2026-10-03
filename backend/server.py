from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import html
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Annotated
from pydantic import BeforeValidator
import uuid
import bcrypt
import jwt
import httpx
import asyncio
import hashlib
import re
import nh3
import aiosmtplib
from email.message import EmailMessage
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Vertical Infinity API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---- Mongo helpers ----
PyObjectId = Annotated[str, BeforeValidator(str)]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---- Models ----
class ContactCreate(BaseModel):
    name: str = Field(..., max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=160)
    message: str = Field(..., max_length=4000)
    topic: Optional[str] = Field(default="General", max_length=80)
    website: Optional[str] = Field(default="", max_length=200)  # honeypot — must stay empty

    @field_validator("name", "message")
    @classmethod
    def _required_not_blank(cls, v):
        v = (v or "").strip()
        if not v:
            raise ValueError("must not be empty")
        return v

    @field_validator("company", mode="before")
    @classmethod
    def _norm_company(cls, v):
        return (v or "").strip()

    @field_validator("topic", mode="before")
    @classmethod
    def _norm_topic(cls, v):
        v = (v or "").strip()
        return v or "General"


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: str = ""
    message: str
    topic: str = "General"
    status: str = "new"
    created_at: str = Field(default_factory=now_iso)


# ---- Auth ----
JWT_ALGORITHM = "HS256"
ACCESS_TTL_MIN = 15
REFRESH_TTL_DAYS = 7
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
CONTACT_RATE_LIMIT = 5
CONTACT_GLOBAL_LIMIT = 60
CONTACT_RATE_WINDOW_SEC = 600
COOKIE_SAMESITE = "lax"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MIN)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TTL_DAYS)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_access_cookie(response: Response, token: str):
    response.set_cookie("access_token", token, httponly=True, secure=True,
                        samesite=COOKIE_SAMESITE, max_age=ACCESS_TTL_MIN * 60, path="/")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


async def get_current_user(request: Request) -> UserOut:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return UserOut(**user)


async def require_admin(user: UserOut = Depends(get_current_user)) -> UserOut:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---- Routes ----
_startup_done = False


async def ensure_startup():
    global _startup_done
    if _startup_done:
        return
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.contact_rate.create_index("created_at", expireAfterSeconds=CONTACT_RATE_WINDOW_SEC)
    await db.contact_rate.create_index("ip")
    await db.allowed_admins.create_index("email", unique=True)
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    _startup_done = True


@api_router.get("/")
async def root():
    return {"message": "Vertical Infinity API is live"}


@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginRequest, request: Request, response: Response):
    await ensure_startup()
    email = payload.email.lower().strip()
    identifier = f"{client_ip(request)}|{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= MAX_LOGIN_ATTEMPTS:
        last = datetime.fromisoformat(attempt["last_attempt"])
        if datetime.now(timezone.utc) - last < timedelta(minutes=LOCKOUT_MINUTES):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not user.get("password_hash") or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": now_iso()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    issue_session_cookies(response, user["id"], email)
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


class GoogleSessionRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=500)


def issue_session_cookies(response: Response, user_id: str, email: str):
    set_access_cookie(response, create_access_token(user_id, email))
    response.set_cookie("refresh_token", create_refresh_token(user_id), httponly=True, secure=True,
                        samesite=COOKIE_SAMESITE, max_age=REFRESH_TTL_DAYS * 86400, path="/")


def env_google_emails() -> set:
    raw = os.environ.get("ADMIN_GOOGLE_EMAILS", "")
    allowed = {e.strip().lower() for e in raw.split(",") if e.strip()}
    allowed.add(os.environ["ADMIN_EMAIL"].lower())
    return allowed


async def allowed_google_emails() -> set:
    allowed = env_google_emails()
    async for doc in db.allowed_admins.find({}, {"_id": 0, "email": 1}):
        allowed.add(doc["email"])
    return allowed


class AccessEntry(BaseModel):
    email: EmailStr


@api_router.get("/admin/access")
async def list_access(user: UserOut = Depends(require_admin)):
    env_set = env_google_emails()
    items = [{"email": e, "source": "env", "added_by": None, "created_at": None} for e in sorted(env_set)]
    rows = await db.allowed_admins.find({}, {"_id": 0}).sort("created_at", 1).to_list(200)
    items += [{**r, "source": "list"} for r in rows if r["email"] not in env_set]
    return items


@api_router.post("/admin/access", status_code=201)
async def add_access(payload: AccessEntry, user: UserOut = Depends(require_admin)):
    email = payload.email.lower().strip()
    if email in await allowed_google_emails():
        raise HTTPException(status_code=409, detail="That account already has access")
    doc = {"email": email, "added_by": user.email, "created_at": now_iso()}
    await db.allowed_admins.insert_one(dict(doc))
    return {**doc, "source": "list"}


@api_router.delete("/admin/access/{email}")
async def remove_access(email: str, user: UserOut = Depends(require_admin)):
    email = email.lower().strip()
    if email in env_google_emails():
        raise HTTPException(status_code=400, detail="This account is configured in the environment and cannot be removed here")
    result = await db.allowed_admins.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"ok": True}


@api_router.post("/auth/google/session", response_model=UserOut)
async def google_session(payload: GoogleSessionRequest, response: Response):
    await ensure_startup()
    try:
        async with httpx.AsyncClient(timeout=15) as http:
            r = await http.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": payload.session_id},
            )
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Could not reach the sign-in service")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired sign-in session")
    data = r.json()
    email = (data.get("email") or "").lower().strip()
    if not email or email not in await allowed_google_emails():
        logger.warning(f"Google sign-in rejected for non-whitelisted account: {email or '<none>'}")
        raise HTTPException(status_code=403, detail="This Google account is not authorised for the Lead Inbox")
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user is None:
        user = {
            "id": str(uuid.uuid4()),
            "email": email,
            "name": data.get("name") or "Admin",
            "role": "admin",
            "created_at": now_iso(),
        }
        await db.users.insert_one({**user, "auth_provider": "google", "picture": data.get("picture")})
    else:
        await db.users.update_one({"email": email}, {"$set": {"picture": data.get("picture"), "last_google_login": now_iso()}})
    issue_session_cookies(response, user["id"], email)
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user.get("role", "admin"))


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    set_access_cookie(response, create_access_token(user["id"], user["email"]))
    return {"ok": True}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: UserOut = Depends(get_current_user)):
    return user


# ---- Google Places (live reviews) ----
PLACES_CID = "885671371509995655"
MAPS_URI_FALLBACK = f"https://maps.google.com/?cid={PLACES_CID}"
PLACES_QUERY = "Vertical Infinity Pvt. Ltd., Borivali West, Mumbai, India"
PLACES_DETAIL_FIELDS = "id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri"

FALLBACK_REVIEWS = {
    "live": False,
    "name": "Vertical Infinity Pvt. Ltd.",
    "rating": 4.9,
    "review_count": None,
    "reviews": [],
    "google_maps_uri": MAPS_URI_FALLBACK,
    "write_review_uri": MAPS_URI_FALLBACK,
}


async def resolve_place_id(api_key: str) -> str:
    doc = await db.places.find_one({"_id": "vertical-infinity"})
    if doc and doc.get("place_id"):
        return doc["place_id"]
    async with httpx.AsyncClient(timeout=8.0) as http:
        r = await http.post(
            "https://places.googleapis.com/v1/places:searchText",
            headers={
                "X-Goog-Api-Key": api_key,
                "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.googleMapsUri",
                "Content-Type": "application/json",
            },
            json={"textQuery": PLACES_QUERY, "languageCode": "en", "regionCode": "IN", "pageSize": 5},
        )
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail="Google Places search failed")
    results = r.json().get("places", [])
    chosen = next((p for p in results if PLACES_CID in (p.get("googleMapsUri") or "")), None)
    if not chosen and results:
        chosen = results[0]
    if not chosen:
        raise HTTPException(status_code=502, detail="Business not found on Google Places")
    place_id = chosen["id"]
    await db.places.update_one(
        {"_id": "vertical-infinity"},
        {"$set": {"place_id": place_id, "updated_at": now_iso()}},
        upsert=True,
    )
    return place_id


@api_router.get("/reviews")
async def get_reviews():
    api_key = os.environ.get("GOOGLE_PLACES_API_KEY", "").strip()
    if not api_key:
        return FALLBACK_REVIEWS
    place_id = None
    try:
        place_id = await resolve_place_id(api_key)
        async with httpx.AsyncClient(timeout=8.0) as http:
            r = await http.get(
                f"https://places.googleapis.com/v1/places/{place_id}",
                headers={"X-Goog-Api-Key": api_key, "X-Goog-FieldMask": PLACES_DETAIL_FIELDS},
            )
        if r.status_code == 404:
            await db.places.delete_one({"_id": "vertical-infinity"})
            raise HTTPException(status_code=502, detail="Stored place_id is obsolete; retry")
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail="Google Places request failed")
    except (httpx.HTTPError, HTTPException):
        return FALLBACK_REVIEWS
    data = r.json()
    reviews = []
    for rev in data.get("reviews", []):
        author = rev.get("authorAttribution") or {}
        reviews.append({
            "text": (rev.get("text") or {}).get("text", ""),
            "rating": rev.get("rating"),
            "publish_time": rev.get("publishTime"),
            "author": author.get("displayName"),
            "author_photo_uri": author.get("photoUri"),
            "google_maps_uri": rev.get("googleMapsUri"),
        })
    return {
        "live": True,
        "name": (data.get("displayName") or {}).get("text"),
        "rating": data.get("rating"),
        "review_count": data.get("userRatingCount", 0),
        "reviews": reviews,
        "google_maps_uri": data.get("googleMapsUri") or MAPS_URI_FALLBACK,
        "write_review_uri": f"https://search.google.com/local/writereview?placeid={place_id}",
    }


# ---- Lead alert email (Emergent managed Resend) ----
EMAIL_BASE_URL = "https://integrations.emergentagent.com"


def lead_alert_html(contact: "Contact") -> str:
    name = html.escape(contact.name)
    email = html.escape(contact.email)
    topic = html.escape(contact.topic)
    company = html.escape(contact.company) if contact.company else "—"
    message = html.escape(contact.message)
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#0a0a0a;padding:22px 32px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">Vertical<span style="color:#CE1F2E;">.</span>Infinity</span>
        <span style="color:#a1a1aa;font-size:12px;float:right;padding-top:4px;">New enquiry</span>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:15px;color:#111;"><strong>{name}</strong> just sent an enquiry via the website.</p>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#333;border-top:1px solid #eee;">
          <tr><td width="110" style="color:#888;">Topic</td><td><span style="background:#CE1F2E;color:#fff;padding:2px 10px;border-radius:99px;font-size:12px;">{topic}</span></td></tr>
          <tr><td style="color:#888;">Email</td><td><a href="mailto:{email}" style="color:#CE1F2E;">{email}</a></td></tr>
          <tr><td style="color:#888;">Company</td><td>{company}</td></tr>
          <tr><td style="color:#888;vertical-align:top;">Message</td><td style="line-height:1.55;">{message}</td></tr>
        </table>
        <p style="margin:22px 0 0;font-size:12px;color:#888;">Reply to this email to answer {name} directly, or open your Lead Inbox.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
"""


async def send_lead_alert_smtp(contact: "Contact"):
    smtp_user = os.environ["SMTP_USER"]
    msg = EmailMessage()
    msg["Subject"] = f"New enquiry — {contact.name} ({contact.topic})"
    msg["From"] = f'{os.environ["EMAIL_FROM_NAME"]} <{smtp_user}>'
    msg["To"] = os.environ["LEAD_ALERT_EMAIL"]
    msg["Reply-To"] = contact.email
    msg.set_content("New enquiry received. Open this email in an HTML-capable client.")
    msg.add_alternative(lead_alert_html(contact), subtype="html")
    await aiosmtplib.send(
        msg,
        hostname=os.environ["SMTP_HOST"],
        port=int(os.environ.get("SMTP_PORT", "587")),
        username=smtp_user,
        password=os.environ["SMTP_PASSWORD"],
        start_tls=True,
        timeout=15,
    )
    logger.info(f"Lead alert sent via SMTP for {contact.id}")


async def send_lead_alert_emergent(contact: "Contact"):
    payload = {
        "to": [os.environ["LEAD_ALERT_EMAIL"]],
        "subject": f"New enquiry — {contact.name} ({contact.topic})",
        "html": lead_alert_html(contact),
        "from_name": os.environ["EMAIL_FROM_NAME"],
        "contact_email": contact.email,
    }
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": os.environ["EMERGENT_EMAIL_KEY"]},
            json=payload,
        )
    resp.raise_for_status()
    logger.info(f"Lead alert sent for {contact.id}: {resp.json().get('id')}")


async def send_lead_alert(contact: "Contact"):
    try:
        if os.environ.get("SMTP_HOST"):
            await send_lead_alert_smtp(contact)
        else:
            await send_lead_alert_emergent(contact)
    except Exception as e:
        logger.error(f"Lead alert email failed for {contact.id}: {e}")


def client_ip(request: Request) -> str:
    # Trust the proxy-provided real IP; the leftmost X-Forwarded-For hop is caller-controlled.
    real = request.headers.get("x-real-ip", "").strip()
    if real:
        return real
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[-1].strip()
    return request.client.host if request.client else "unknown"


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate, request: Request, background_tasks: BackgroundTasks):
    await ensure_startup()
    contact = Contact(**payload.model_dump(exclude={"website"}))
    if payload.website:
        logger.warning(f"Honeypot triggered from {client_ip(request)} — dropped")
        return contact
    ip = client_ip(request)
    window_start = datetime.now(timezone.utc) - timedelta(seconds=CONTACT_RATE_WINDOW_SEC)
    recent = await db.contact_rate.count_documents({"ip": ip, "created_at": {"$gte": window_start}})
    if recent >= CONTACT_RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again in a few minutes.")
    total_recent = await db.contact_rate.count_documents({"created_at": {"$gte": window_start}})
    if total_recent >= CONTACT_GLOBAL_LIMIT:
        logger.warning("Global contact cap reached — possible flood")
        raise HTTPException(status_code=429, detail="We're receiving a lot of messages right now. Please try again shortly.")
    await db.contact_rate.insert_one({"ip": ip, "created_at": datetime.now(timezone.utc)})
    doc = contact.model_dump()
    await db.contacts.insert_one(doc)
    if os.environ.get("VERCEL"):
        try:
            await asyncio.wait_for(send_lead_alert(contact), timeout=15)
        except Exception as e:
            logger.error(f"Lead alert email timed out/failed for {contact.id}: {e}")
    else:
        background_tasks.add_task(send_lead_alert, contact)
    return contact


FINDER_SITUATIONS = {"idea", "manual", "legacy", "ai", "ux", "sell", "slow", "care", "bugs", "updates", "hosting", "accounts"}
FINDER_PRIORITIES = {"speed", "cost", "reliability", "growth"}
FINDER_SERVICES = {
    "product-development", "workflow-automation", "legacy-modernization", "ai-automation",
    "experience-design", "digital-commerce", "performance-services", "managed-support",
}


class FinderEvent(BaseModel):
    situation: str
    priority: str
    service: str


@api_router.post("/finder", status_code=204)
async def record_finder(payload: FinderEvent, request: Request):
    if payload.situation not in FINDER_SITUATIONS or payload.priority not in FINDER_PRIORITIES or payload.service not in FINDER_SERVICES:
        raise HTTPException(status_code=422, detail="Unknown finder value")
    await db.finder_events.insert_one({
        "id": str(uuid.uuid4()),
        "situation": payload.situation,
        "priority": payload.priority,
        "service": payload.service,
        "ip_hash": hashlib.sha256(client_ip(request).encode()).hexdigest()[:16],
        "created_at": datetime.now(timezone.utc),
    })
    return Response(status_code=204)


async def _count_by(field: str, since: Optional[datetime] = None):
    match = {"created_at": {"$gte": since}} if since else {}
    rows = await db.finder_events.aggregate([
        {"$match": match},
        {"$group": {"_id": f"${field}", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]).to_list(50)
    return [{"key": r["_id"], "count": r["count"]} for r in rows]


@api_router.get("/finder/insights")
async def finder_insights(days: int = 30, user: UserOut = Depends(require_admin)):
    days = max(1, min(days, 365))
    since = datetime.now(timezone.utc) - timedelta(days=days)
    total_all = await db.finder_events.count_documents({})
    total_window = await db.finder_events.count_documents({"created_at": {"$gte": since}})
    recent = await db.finder_events.find(
        {}, {"_id": 0, "id": 1, "situation": 1, "priority": 1, "service": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(20)
    for r in recent:
        r["created_at"] = r["created_at"].isoformat()
    return {
        "days": days,
        "total_all_time": total_all,
        "total_window": total_window,
        "by_service": await _count_by("service", since),
        "by_situation": await _count_by("situation", since),
        "by_priority": await _count_by("priority", since),
        "recent": recent,
    }



@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(user: UserOut = Depends(require_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.delete("/contact/{contact_id}")
async def delete_contact(contact_id: str, user: UserOut = Depends(require_admin)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"ok": True}


class StatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def _valid_status(cls, v):
        if v not in {"new", "contacted", "closed"}:
            raise ValueError("status must be one of: new, contacted, closed")
        return v


@api_router.patch("/contact/{contact_id}/status", response_model=Contact)
async def update_contact_status(contact_id: str, payload: StatusUpdate, user: UserOut = Depends(require_admin)):
    result = await db.contacts.find_one_and_update(
        {"id": contact_id},
        {"$set": {"status": payload.status}},
        projection={"_id": 0},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result


# ---- Editable site content (admin CMS overrides) ----
CONTENT_KEY_RE = re.compile(r"^[A-Za-z0-9_.\-]{1,200}$")
CONTENT_ALLOWED_TAGS = {"p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "span", "h1", "h2", "h3", "h4", "blockquote", "sub", "sup"}
CONTENT_ALLOWED_ATTRS = {"a": {"href", "target"}, "span": {"class"}, "p": {"class"}}


class ContentValue(BaseModel):
    value: str = Field(..., max_length=20000)


@api_router.get("/content")
async def get_content():
    rows = await db.content_overrides.find({}, {"_id": 0, "key": 1, "value": 1}).to_list(2000)
    return {r["key"]: r["value"] for r in rows}


@api_router.put("/content/{key}")
async def put_content(key: str, payload: ContentValue, user: UserOut = Depends(require_admin)):
    if not CONTENT_KEY_RE.match(key):
        raise HTTPException(status_code=422, detail="Invalid content key")
    clean = nh3.clean(payload.value, tags=CONTENT_ALLOWED_TAGS, attributes=CONTENT_ALLOWED_ATTRS,
                      link_rel="noopener noreferrer", url_schemes={"http", "https", "mailto", "tel"})
    await db.content_overrides.update_one(
        {"key": key},
        {"$set": {"key": key, "value": clean, "updated_at": now_iso(), "updated_by": user.email}},
        upsert=True,
    )
    return {"key": key, "value": clean}


@api_router.delete("/content/{key}")
async def delete_content(key: str, user: UserOut = Depends(require_admin)):
    await db.content_overrides.delete_one({"key": key})
    return {"ok": True}


# ---- Image uploads (Emergent object storage) ----
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
STORAGE_APP = "vertical-infinity"
IMAGE_TYPES = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024
_storage_key: Optional[str] = None


async def storage_key(force: bool = False) -> str:
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    async with httpx.AsyncClient(timeout=30) as http:
        r = await http.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ["EMERGENT_LLM_KEY"]})
    r.raise_for_status()
    _storage_key = r.json()["storage_key"]
    return _storage_key


@api_router.post("/uploads/image", status_code=201)
async def upload_image(file: UploadFile = File(...), user: UserOut = Depends(require_admin)):
    ext = IMAGE_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=415, detail="Only PNG, JPG, WEBP, GIF or SVG images are allowed")
    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image must be under 5 MB")
    file_id = str(uuid.uuid4())
    path = f"{STORAGE_APP}/uploads/{file_id}.{ext}"
    key = await storage_key()
    async with httpx.AsyncClient(timeout=120) as http:
        r = await http.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": file.content_type}, content=data)
        if r.status_code == 404:
            key = await storage_key(force=True)
            r = await http.put(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key, "Content-Type": file.content_type}, content=data)
    if r.status_code >= 400:
        logger.error(f"Storage upload failed {r.status_code}: {r.text[:200]}")
        raise HTTPException(status_code=502, detail="Image storage is unavailable right now")
    await db.files.insert_one({
        "id": file_id, "storage_path": r.json()["path"], "original_filename": file.filename,
        "content_type": file.content_type, "size": len(data), "uploaded_by": user.email,
        "is_deleted": False, "created_at": now_iso(),
    })
    return {"id": file_id, "url": f"/api/files/{file_id}"}


@api_router.get("/files/{file_id}")
async def serve_file(file_id: str):
    rec = await db.files.find_one({"id": file_id, "is_deleted": False}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=404, detail="File not found")
    key = await storage_key()
    async with httpx.AsyncClient(timeout=60) as http:
        r = await http.get(f"{STORAGE_URL}/objects/{rec['storage_path']}", headers={"X-Storage-Key": key})
        if r.status_code == 404:
            key = await storage_key(force=True)
            r = await http.get(f"{STORAGE_URL}/objects/{rec['storage_path']}", headers={"X-Storage-Key": key})
    if r.status_code >= 400:
        raise HTTPException(status_code=502, detail="Could not load file")
    return Response(content=r.content, media_type=rec["content_type"],
                    headers={"Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff"})


# Include the router in the main app
app.include_router(api_router)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    return response

cors_origins = [o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials="*" not in cors_origins,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_admin():
    await ensure_startup()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

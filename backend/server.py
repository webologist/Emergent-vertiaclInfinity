from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional, Annotated, Any
from bson import ObjectId
from pydantic import BeforeValidator
import uuid
import bcrypt
import jwt
import httpx
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
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(..., max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=160)
    message: str = Field(..., max_length=4000)
    topic: Optional[str] = Field(default="General", max_length=80)

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
    created_at: str = Field(default_factory=now_iso)


# ---- Auth ----
JWT_ALGORITHM = "HS256"
ACCESS_TTL_MIN = 15
REFRESH_TTL_DAYS = 7
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


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
                        samesite="none", max_age=ACCESS_TTL_MIN * 60, path="/")


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


# ---- Routes ----
@api_router.get("/")
async def root():
    return {"message": "Vertical Infinity API is live"}


@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower().strip()
    identifier = email
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= MAX_LOGIN_ATTEMPTS:
        last = datetime.fromisoformat(attempt["last_attempt"])
        if datetime.now(timezone.utc) - last < timedelta(minutes=LOCKOUT_MINUTES):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": now_iso()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_access_cookie(response, create_access_token(user["id"], email))
    response.set_cookie("refresh_token", create_refresh_token(user["id"]), httponly=True, secure=True,
                        samesite="none", max_age=REFRESH_TTL_DAYS * 86400, path="/")
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


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
    except httpx.HTTPError:
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
    company = contact.company or "—"
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr><td style="background:#0a0a0a;padding:22px 32px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">Vertical<span style="color:#CE1F2E;">.</span>Infinity</span>
        <span style="color:#a1a1aa;font-size:12px;float:right;padding-top:4px;">New enquiry</span>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 18px;font-size:15px;color:#111;"><strong>{contact.name}</strong> just sent an enquiry via the website.</p>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#333;border-top:1px solid #eee;">
          <tr><td width="110" style="color:#888;">Topic</td><td><span style="background:#CE1F2E;color:#fff;padding:2px 10px;border-radius:99px;font-size:12px;">{contact.topic}</span></td></tr>
          <tr><td style="color:#888;">Email</td><td><a href="mailto:{contact.email}" style="color:#CE1F2E;">{contact.email}</a></td></tr>
          <tr><td style="color:#888;">Company</td><td>{company}</td></tr>
          <tr><td style="color:#888;vertical-align:top;">Message</td><td style="line-height:1.55;">{contact.message}</td></tr>
        </table>
        <p style="margin:22px 0 0;font-size:12px;color:#888;">Reply to this email to answer {contact.name} directly, or open your Lead Inbox.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
"""


async def send_lead_alert(contact: "Contact"):
    try:
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
    except Exception as e:
        logger.error(f"Lead alert email failed for {contact.id}: {e}")


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate, background_tasks: BackgroundTasks):
    contact = Contact(**payload.model_dump())
    doc = contact.model_dump()
    await db.contacts.insert_one(doc)
    background_tasks.add_task(send_lead_alert, contact)
    return contact


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(user: UserOut = Depends(get_current_user)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.delete("/contact/{contact_id}")
async def delete_contact(contact_id: str, user: UserOut = Depends(get_current_user)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"ok": True}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Include the router in the main app
app.include_router(api_router)

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
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Auth testing notes (Vertical Infinity admin)
- Admin session model: JWT httpOnly cookies `access_token` (15m) + `refresh_token` (7d), issued by BOTH password login (`POST /api/auth/login`) and Google sign-in (`POST /api/auth/google/session` {session_id}).
- Google flow: /admin "Sign in with Google" → https://auth.emergentagent.com/?redirect=<origin>/admin → returns to /admin#session_id=... → frontend POSTs session_id → backend fetches https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data (X-Session-ID) → email must be in ADMIN_GOOGLE_EMAILS (comma list) or equal ADMIN_EMAIL, else 403.
- Cannot complete real Google OAuth in automation; test: invalid session_id → 401 shown on login card; allowlist logic unit-tested via mocked httpx.
- Protected checks: GET /api/auth/me, GET /api/contact, GET /api/finder/insights with cookies or `Authorization: Bearer <access_token JWT>`.

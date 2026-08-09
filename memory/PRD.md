# Vertical Infinity — One-Page Agency Website (PRD)

## Original Problem Statement
Build a one-page website per an attached PDF for "Vertical Infinity Pvt. Ltd." (AI-enabled digital agency).
Clean techy style, highly animated hero banner, clean/clear fonts, best-suited icons, color palette
black + white with rare crimson red. Later: LIGHT MODE BY DEFAULT with dark-mode toggle.

## User Choices
- Working contact form saved to database.
- Generated realistic placeholder team & client identities.
- Hero: kinetic bold typography + sleek tech/particle vibe.
- Real embedded Google Map.
- Live Google reviews requested — STATIC card until user supplies Google Places API key + Place ID.
- Case studies: realistic placeholders to be swapped with real content later.
- Lead inbox: full email/password admin login.
- Logo: designer's choice (vertical infinity mark).
- Theme: LIGHT default, dark toggle (June 2026 request).

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, framer-motion, Lenis, shadcn/ui, sonner, react-router-dom.
  Routes: `/` one-page site, `/admin` lead inbox, `*` falls back to home.
- Backend: FastAPI + Motor (MongoDB). Routes prefixed `/api`.
- DB: MongoDB `contacts`, `users`, `login_attempts` collections.
- Auth: JWT httpOnly cookies (access 15m + refresh 7d), bcrypt, admin seeded from backend/.env,
  account-based brute-force lockout (5 fails → 15 min, atomic $inc), explicit CORS allowlist.
- Credentials: see /app/memory/test_credentials.md.

## Design System
- "Swiss brutalist meets tech futurism". Themeable via CSS vars (`--c-ink/surface/elevated/fg/dim/bgstrong`),
  Tailwind `white`/`black` remapped to fg/bgstrong vars; `cwhite` = literal white for on-crimson text.
- Light (default): bg #F7F6F3, cards #FFF, fg #111. Dark (.dark on html): bg #0A0A0A, fg #FFF.
- Accent crimson #CE1F2E. Fonts: Outfit (display), Manrope (body). Theme persisted in localStorage `vi-theme`.
- Brand: inline SVG vertical-infinity mark (Logo.jsx, currentColor bottom loop + crimson top), favicon.svg.
- Hero image swaps per theme (ASSETS.heroBg dark / ASSETS.heroBgLight light).

## Implemented
### 2026-06 (initial MVP)
- Kinetic hero, focused areas bento, SME marquee, growth/testimonials + static Google reviews card,
  journey manifesto, team grid, contact form (POST /api/contact) + dark-styled embedded map, footer.
- Backend contact create/list with trimmed validation. Testing iteration_1 passed.

### 2026-06 (this fork)
- Case Studies section (#work): 3 placeholder projects (Meridian Health, Kadence, Orbital) with
  generated imagery, stats, tags; "Work" nav link; footer link mapped.
- Brand logo: SVG vertical-infinity mark in nav/footer + SVG favicon.
- Lead Inbox at /admin: email/password login (JWT cookies), enquiry list with topic pills,
  delete, refresh, logout, empty state. GET/DELETE /api/contact protected; POST stays public.
- Security fixes from iteration_2: account-based atomic lockout (verified 429 on 6th attempt),
  CORS explicit origin allowlist with credentials (wildcard header seen publicly is ingress-added).
- Light theme DEFAULT + dark toggle (Sun/Moon in nav), full CSS-var theming, per-theme hero art,
  map dark filter only in dark mode, dynamic sonner theme. Verified via screenshots both themes.

- Case Studies section: built 2026-06, then REMOVED at user request (section, nav "Work" link, content, file deleted).
  Footer "Case Studies" link falls back to #contact.

- Lead Alerts (2026-06): every new enquiry emails sunil@verticalinfinity.in via Emergent-managed Resend proxy
  (EMERGENT_EMAIL_KEY + EMAIL_FROM_NAME + LEAD_ALERT_EMAIL in backend/.env, EMAIL_BASE_URL constant).
  Sent as FastAPI BackgroundTask with reply-to = lead's email; failures only logged, never break /api/contact.
  Verified: proxy 202, real submission → "Lead alert sent" log with email id.

- Hero stats (2026-06): removed "100% IP ownership" & "4 Industries served"; "Years building" now rolling
  (current year − 2003, auto-updates each January).

## Verified
- iteration_1: core site flows. iteration_2: auth/admin/case-studies/E2E (100% frontend; 2 backend
  security issues found → fixed and curl-verified).
- Theme: self-tested via screenshots (light hero/sections/contact, dark hero/contact, localStorage persistence).

## Backlog
- P1: LIVE Google Reviews — pipeline BUILT (GET /api/reviews, Places API New: Text Search → Place Details,
  place_id cached in `places` collection, validated against CID 885671371509995655). Runs in "listing mode"
  (real 4.9 rating + real Maps links via https://maps.google.com/?cid=885671371509995655) until user provides
  GOOGLE_PLACES_API_KEY in backend/.env (Google Cloud → enable Places API (New) → server API key). Live path
  implemented per integration playbook but NOT runtime-tested without key.
- P2: Real case-study content swap; real destination pages for footer links; functional site search.
- P3: Real team photos/client logos, blog pages, lead read/unread status.

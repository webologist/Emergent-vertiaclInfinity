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

- Power for SMEs highlight (2026-06): section is now an inverted full-bleed black band (scoped `dark` class)
  with crimson glows, crimson kicker, and a crimson-outlined second marquee row — pops in both themes.

- Growth subtext (2026-06): Chesky quote ("If you build a great experience…, — Brian Chesky, CEO of Airbnb")
  now sits as display subtext under the "Drivers of our growth" overline; removed from quote cards to avoid
  duplication (Branson card now full-width).

- Growth restructure (2026-06, per PDF): removed "Trusted by teams that ship."; client wordmarks moved
  directly under Chesky attribution; added PDF line "We would like your logo to be here." as dashed pill
  CTA (scrolls to #contact); Branson card + reviews card now share the bottom row.

- Journey per PDF (2026-06): removed parallax image (PDF has none); chapters in PDF order; "Our Philosophy"
  highlighted as crimson-bordered card with glow, crimson heading and emphasized lead sentence.

- Growth per PDF v2 (2026-06): Branson quote now plain display text (exact user wording) under the "your logo"
  pill on the LEFT; Google Reviews block moved to RHS with an auto-scrolling vertical review feed
  (`.animate-marquee-y`, pauses on hover) — fed by /api/reviews when live, PDF's two sample reviews
  (Anonymous 5★) as fallback.
- Journey per PDF v2 (2026-06): heading "We, our Journey" top-left, chapters stacked full-width, no numbers,
  full PDF "Since 2003" text; "Our Philosophy" keeps its crimson highlight card (user request).

- Lead Status (2026-06): contacts have status new/contacted/closed (default new, older docs coerce to new);
  PATCH /api/contact/{id}/status (protected, validates values); inbox has filter tabs with counts, status
  badges and per-lead segmented control with optimistic updates. Curl + UI verified.

## Verified
- iteration_1: core site flows. iteration_2: auth/admin/case-studies/E2E (100% frontend; 2 backend
  security issues found → fixed and curl-verified).
- Theme: self-tested via screenshots (light hero/sections/contact, dark hero/contact, localStorage persistence).

## Backlog
- ✅ LIVE Google Reviews (2026-06): user's GOOGLE_PLACES_API_KEY set in backend/.env; /api/reviews returns
  live=true, rating 4.9, 21 Google reviews, real place_id ChIJ910PJ2Cx5zsRhxiWfmuJSgw (cached in `places`).
  NOTE: Google returns ZERO review text snippets for this listing even with FieldMask "*" (ratings are
  star-only / no retrievable text) — scrolling feed intentionally falls back to PDF sample quotes while
  showing LIVE rating+count. If text reviews appear on Google later, they stream automatically.
  Key is server-side only; recommend user restricts it to Places API (New) in Cloud Console.
- P2: Real case-study content swap; real destination pages for footer links; functional site search.
- P3: Real team photos/client logos, blog pages.

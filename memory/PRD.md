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

## Changelog (2026-06 continued — fork)
- Hero redesign: removed old bg image; added interactive "fish in water" particle field (CodePen alexsafayan
  adaptation, theme-aware, reduced-motion safe) + glowing techno "8" mark on right (`/vi-8-hero.png`),
  float+glow CSS. Headline size reduced, CTA stacked below sub, content constrained to left ~62% to avoid
  overlap; fits 100svh at all resolutions. Brand logo replaced with `/vi-logo.png` (nav+footer+favicon).
- SME section: pills are clickable — bubble with random Hinglish phrase, pop sound (Web Audio), auto-dismiss,
  tappable-to-contact. EXCEPTION: "Project Development" pill routes to /product-development.
  Shooting stars now travel bottom→top.
- Growth section: shows 9 logos first + crimson "View all brands" toggle (no count), "Show less" smooth-scrolls
  to grid top, logo hover tooltips (client name).
- Footer: WIP red superscript on 9 service labels; "Domain, Hosting, Email" → https://services.zxis.com (ext);
  Sitemap removed; added "Product Development" internal route link.
- Floating scroll-to-top button (bottom-right, appears >600px, works with/without Lenis).
- NEW PAGE /product-development (2026-06): SEO/AIO optimized inner page. React 19 head hoisting for
  <title>/meta/canonical/OG + 3 JSON-LD blocks (Service, BreadcrumbList, FAQPage). Sections: hero+breadcrumb,
  value props, animated Discover→Design→Build→Launch→Scale SVG process flow (`components/diagrams/PDDiagrams.jsx`),
  budget-ladder diagram, outcomes, FAQ (<details>), embedded contact form (posts to /api/contact, topics
  New Project/MVP/Custom App/Not sure). Multiple CTAs → #contact / #process. Linked from: Focus "Product
  Development" card, SME "Project Development" pill, Footer. Nav updated (useNavigate/useLocation) to route
  home+hash from inner pages; Home scrolls to hash on arrival. All entry points + form self-tested (screenshots).
- MORE SERVICE PAGES (2026-06): refactored into reusable data-driven `pages/ServicePage.jsx` + shared diagrams
  (`components/diagrams/PDDiagrams.jsx`: ProcessFlow(steps), LadderDiagram, BudgetLadder, BeforeAfter).
  Live routes: /product-development, /workflow-automation, /legacy-modernization, /ai-automation,
  /experience-design, /digital-commerce, /performance-services, /managed-support. Each: full SEO
  (title/meta/canonical/OG via React 19 head hoist) + 3 JSON-LD (Service, BreadcrumbList, FAQPage), hero+
  breadcrumb, values, animated process flow, highlight diagram, outcomes, FAQ, embedded contact form
  (POST /api/contact). Linked from Focus cards (01/02/03) + Footer Services/More columns (react-router Link
  via ROUTE_LINKS). Footer WIP superscript now only on Case Studies + Social Responsibility. Bottom "Legal"
  link removed. All 8 pages self-tested (render + JSON-LD + footer links + Legal removed).

## 2026-06 — Contact update
- WhatsApp number changed to +91 8691948779 in `frontend/src/data/content.js` (renders in Get in touch section). Verified in preview; redeploy required for production.

## 2026-09-25 — Vercel compatibility (additive) + SEO/AIO
- Vercel: `/app/api/index.py` ASGI entry, root `/app/requirements.txt`, `/app/vercel.json` (rewrites /api → function, SPA fallback, maxDuration 30). server.py: SMTP lead alert path when `SMTP_HOST` set (aiosmtplib STARTTLS), awaited with 15s timeout when `VERCEL` env set; `ensure_startup()` idempotent seed called at startup + login. Frontend REACT_APP_BACKEND_URL falls back to "". Tested: iteration_6 (49/50, CORS intentional).
- GA4 ID switched to G-9S5PLRJSEV (index.html; SPA page_view tracker unchanged).
- SEO/AIO: static robots/OG/Twitter meta + Organization/ProfessionalService/WebSite JSON-LD in index.html; homepage canonical via React; robots.txt (AI crawlers allowed, /admin & /api disallowed, sitemap ref); llms.txt; sitemap lastmod; og:image + twitter tags on service pages; noindex on /admin. Verified via DOM inspection.
- Not done (needs user): Google Search Console verification token, prerendering/SSR for non-JS crawlers.

## 2026-09-25 — Prerender + anti-spam + WhatsApp CTA
- Build-time prerender (SSG): `frontend/scripts/prerender.mjs` (postbuild, esbuild + react-dom/server + StaticRouter) writes static HTML for / and 8 service pages into build/ (per-route title/meta/canonical/JSON-LD). Fail-safe: any error keeps plain SPA build. `index.js` hydrates when #root has content. App.js exports router-less `AppInner`; page configs exported. Verified: raw HTML has full content, hydration clean, no console errors, no duplicate JSON-LD.
- Anti-spam: honeypot `website` field (both forms, silently dropped) + per-IP rate limit 5/10min via Mongo `contact_rate` TTL collection (429 → friendly toast).
- WhatsApp click-to-chat (wa.me + pre-filled greeting, new tab) and mailto link in Get in touch.
- Search Console: no token provided — verify via the Google Analytics method (GA4 tag already installed).
- Tests: iteration_7 all pass.

## 2026-09-25 — Google reviews section + legal pages
- `GoogleReviews` section (live 4.9★/count badge via /api/reviews, Read/Write review links; optional curated review cards from `GOOGLE_REVIEWS` in content.js — currently EMPTY because Places API returns no review bodies; user must paste real reviews) on homepage + all 8 service pages. Old card removed from Growth.
- Legal pages `/privacy-policy`, `/terms-of-service` (data in `data/legal.js`, renderer `pages/LegalPage.jsx`), footer bottom-bar links, sitemap/llms/prerender updated. Template text — not legal advice.
- Tests: iteration_8 all pass.

## 2026-09-25 — Related services
- `RelatedServices` section (3 curated cross-links per service, `data/services.js` SERVICE_INDEX + RELATED_SERVICES) inserted after FAQ on all 8 service pages. Self-tested (desktop/mobile, navigation, no errors).

## 2026-09-25 — Service finder + deploy check
- `ServiceFinder` ("Which service do I need?") 2-step helper on homepage after What We Do (data in `data/serviceHelper.js`, GA event `service_finder_result`). Self-tested desktop/mobile.
- Deployment check: fixed BLOCKER (.gitignore was excluding .env files) → PASS.

## 2026-09-25 — Finder insights
- POST /api/finder (public, enum-validated, stores hashed IP) → `finder_events`; GET /api/finder/insights?days= (admin) → totals, by_service/by_situation/by_priority, recent 20. Admin inbox shows `FinderInsights` panel (7/30/90d). Self-tested via curl + browser e2e.

## 2026-09-25 — Code review fixes
- Tests load admin creds from env/backend/.env; place_id initialised; ServicePage JSON-LD memoised with proper deps; content-based list keys; dev-only console logging; Contact split into ContactDetails/ContactForm. Skipped (false positives/intentional): mount-only effect deps (Lenis, FishParticles, Admin), `is None` comparisons, cookie-name strings flagged as secrets, test-suite complexity.

## 2026-09-25 — Google sign-in (admin)
- Emergent-managed Google Auth on /admin alongside password login. POST /api/auth/google/session exchanges session_id server-side, enforces allowlist (ADMIN_GOOGLE_EMAILS env + ADMIN_EMAIL → 403 otherwise), issues the same JWT httpOnly cookies. Callback detected via useLocation().hash; errors shown on login card. Tests: iteration_9 all pass (17/17). Real Google login must be confirmed manually by the user.

## 2026-09-25 — Team access list
- Admin-protected GET/POST/DELETE /api/admin/access backed by `allowed_admins` (unique email index). Google allowlist = env (ADMIN_GOOGLE_EMAILS + ADMIN_EMAIL, shown as Locked) ∪ DB list. `TeamAccess` panel in admin inbox. Self-tested via curl + browser e2e.

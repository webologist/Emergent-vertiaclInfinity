# Vertical Infinity — One-Page Agency Website (PRD)

## Original Problem Statement
Build a one-page website per an attached PDF for "Vertical Infinity Pvt. Ltd." (AI-enabled digital agency).
Clean techy style, highly animated hero banner, clean/clear fonts, best-suited icons, color palette
black + white with rare crimson red.

## User Choices
- Working contact form saved to database.
- Generated realistic placeholder team & client identities.
- Hero: kinetic bold typography + sleek tech/particle vibe (designer's choice).
- Real embedded Google Map.
- Live Google reviews requested — currently a premium STATIC card (needs Google Places API key + Place ID to go live).

## Architecture
- Frontend: React 19 (CRAF/craco), Tailwind, framer-motion, Lenis smooth scroll, shadcn/ui, sonner toasts.
- Backend: FastAPI + Motor (MongoDB). Routes prefixed `/api`.
- DB: MongoDB `contacts` collection.

## Design System
- Dark "Swiss brutalist meets tech futurism". BG #0A0A0A, surfaces #121212/#1A1A1A, text white/#A1A1AA.
- Accent crimson #CE1F2E (darkened from #E63946 for WCAG AA on buttons/pills).
- Fonts: Outfit (display/headings), Manrope (body). Grain overlay + 1px hairline grid.

## Implemented (2026-06)
- Sticky glass nav with animated links, search (toast), CTA, mobile menu.
- Kinetic hero: masked line-by-line reveal, parallax bg (generated abstract tech image), stats, scroll cue.
- Our Focused Areas: 3-card bento (Workflow Automation, Product Development, Legacy Modernization).
- Power for SMEs: dual editorial marquee (outlined kinetic text) + tag pills + copy.
- Drivers of Growth: two testimonials, client wordmark grid, Google reviews card (STATIC/MOCKED).
- We/Our Journey: numbered manifesto chapters + parallax signature image, sticky layout.
- Team: 6-member grayscale-to-color hover grid.
- Contact Human: working form (POST /api/contact) with topic pills, sonner toasts, dark-styled embedded Google Map.
- Footer: multi-column sitemap with mapped anchor destinations, gov/startup badges, massive brand mark, legal toast.
- Backend: `/api/contact` POST (strips + validates required, normalizes null optionals, EmailStr) & GET list; legacy `/api/status`.

## Verified
- Backend curl: valid=200, null company/topic=200, whitespace name=422, invalid email=422, topic defaults to "General".
- UI: full form submission → success toast + reset. Hero + all sections render, no console errors. Testing agent iteration_1 core flows pass.

## Backlog
- P1: Go-live Google Reviews (needs Google Places API key + Place ID). Currently MOCKED static card.
- P2: Real destination pages for footer service/company links (currently anchor to closest section/contact).
- P2: Functional site search.
- P2: Admin view for contact submissions.
- P3: Custom brand logo/favicon, blog/case-study pages.

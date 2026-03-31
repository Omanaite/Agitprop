# Project Overview - Artopia (Akemi Pilot)

## Product
Artopia is a Next.js App Router + Supabase product for artist websites and operations. The current production pilot is Akemi Tattoo, combining a brand-forward public portfolio with a dedicated operational admin console.

## Core Product Goals
- Showcase tattoo work in a strong editorial format.
- Allow visitors to browse galleries and published updates.
- Let visitors request bookings and contact the artist.
- Give the artist a private workspace to manage public content.
- Prepare the codebase for safe expansion after MVP into a SaaS-ready multi-artist platform.

## Current MVP Scope
### Public Experience
- Homepage with configurable section order and labels.
- Theme switching (`light`, `eye`, `dark`).
- Locale switching (`en`, `es`, `de`).
- Public galleries and gallery detail pages.
- Public posts feed.
- Booking and contact forms.
- Registration with email confirmation and OAuth sign-up.

### Admin Experience
- Email/password admin login.
- OAuth admin login.
- CRUD for galleries, pieces, and posts.
- Homepage composition manager.
- Admin profile.
- Integrations view.
- Dedicated admin design system, separate from the public site.

## Architecture Summary
### Frontend
- Next.js App Router.
- Server components for public rendering.
- Client components for interactive admin tooling.
- Separate visual systems for public vs admin.
- Dedicated Artopia service page for product positioning and onboarding entry (`/artopia`).

### Backend
- Supabase Postgres with RLS.
- Supabase Auth for admin auth and standard account registration.
- Supabase Storage for gallery media.
- Next.js route handlers for privileged mutations.

### Security Baseline
- Role-based access through `app_metadata.role = admin`.
- RLS on protected tables.
- Rate limiting on public write flows.
- Same-origin enforcement on public submissions.
- Honeypot fields on public forms.
- Reduced stack fingerprinting.

### SEO Baseline
- Route metadata.
- Canonical baseline.
- `robots.txt`.
- `sitemap.xml`.
- JSON-LD.
- OpenGraph and Twitter images.

## Scalability Direction
The current architecture is intentionally single-artist for MVP, but it is being documented with safe expansion patterns:
- optional integrations
- feature toggles
- future calendar/notification modules
- future multi-tenant exploration
- safe degradation when providers are disconnected

## Current MVP Blockers
The MVP is functionally close, but still depends on:
- production verification
- third-party configuration checks
- email/OAuth smoke tests
- final content/SEO review

## Source of Truth Documents
- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/POST_MVP_BACKLOG.md`
- `openspec/changes/admin-content-management/*`



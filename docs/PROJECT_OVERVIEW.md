# Project Overview - Agitprop

## Product
Agitprop is a Next.js App Router + Supabase product for artist websites and operations. The current production pilot is Akemi, the first tenant on the platform, used to validate the multi-tenant SaaS architecture.

## Core Product Goals
- Give any independent artist a professional public presence with portfolio, posts, and booking.
- Allow visitors to browse galleries, published updates, and contact or book the artist.
- Give the artist a private workspace to manage all public content without writing code.
- Prepare the codebase for safe expansion after MVP into a SaaS-ready multi-artist platform.

## Current MVP Scope
### Public Experience
- SaaS-first entry at `/` (redirect to `/studio/login`).
- Pilot artist site at `/akemi` with configurable section order and labels.
- Tenant public slug routes at `/{artist-slug}` for artist-isolated public sites.
- Theme switching (`light`, `eye`, `dark`).
- Locale switching (`en`, `es`, `de`).
- Public galleries and gallery detail pages.
- Public posts feed.
- Booking and contact forms.
- Registration with email confirmation and OAuth sign-up.

### Private Experience
- Platform admin login (email/password).
- Artist login (email/password and OAuth in studio flow).
- Platform admin console (SaaS governance scope only).
- Artist workspace (`/studio`) for artist operations.
- Profile, integrations, and payment settings in artist-scoped endpoints (`/api/studio/*`).
- Dedicated private design system, separate from the public site.

## Architecture Summary
### Frontend
- Next.js App Router.
- Server components for public rendering.
- Client components for interactive admin tooling.
- Separate visual systems for public vs admin.
- Dedicated Agitprop service page for product positioning and onboarding entry (`/agitprop`).
- Private surfaces split is active:
  - Platform Admin Console (`/admin`) for tenant lifecycle and global controls.
  - Artist Workspace (`/studio`) for artist-level operations.

### Backend
- Supabase Postgres with RLS.
- Supabase Auth for admin auth and standard account registration.
- Supabase Storage for gallery media.
- Next.js route handlers for privileged mutations.
- Tenant bootstrap hook on auth flows to create initial SaaS records for artist users.
- Tenant policy controls in `artist_tenants` now include:
  - `site_theme` (`atelier`, `mono`, `ink`, `akemi_brutalist`)
  - `custom_domain` (reserved for domain mapping rollout)

### Security Baseline
- Role-based access with explicit console routing:
  - platform admin users -> `/admin`
  - artist users -> `/studio`
- RLS on protected tables.
- Rate limiting on public write flows.
- Same-origin enforcement on public submissions.
- Honeypot fields on public forms.
- Reduced stack fingerprinting.
- Studio settings endpoints now validate artist auth first and persist via server-side privileged client to avoid cross-role RLS mismatch.

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
- multi-tenant slug/domain routing with artist data isolation
- theme entitlement policy (Akemi custom brutalist reserved, base templates for others)
- safe degradation when providers are disconnected
- strict role boundaries between platform governance and artist content operations

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




# Master Document - Agitprop (Akemi Pilot)

Document role: Derived
Owner: Documentation export
Scope: Broad project summary derived from canonical product, roadmap, and release docs
Last updated: 2026-04-29

Date: 2026-04-01  
Version: 2.1  
Status: MVP hardening + SaaS role-split stabilization

## 1. Product Summary
Agitprop is a platform for independent artists combining:
- public portfolio and discovery
- private operations workspace
- SaaS governance layer for platform administration

Akemi remains the pilot premium tenant while architecture evolves toward multi-tenant SaaS.

## 2. MVP Definition (Current Gate)
MVP is complete only when:
- production deploy is stable on latest `vercel` branch commit
- public pages (home, galleries, posts, booking, contact) work in production
- theme and locale switching work in production
- platform admin login works (`/admin`)
- artist login works (`/studio/login`) and routes to `/studio`
- artist settings modules run on `/api/studio/*` without platform-admin dependency
- baseline SEO/security hardening is active

Reference: `docs/MVP_STATUS.md`

## 3. Product Scope
### Public
- homepage with composition controls
- galleries listing and detail pages
- public posts
- booking and contact forms
- locale/theme toggles
- service page (`/agitprop`)

### Private
- Platform Admin Console (`/admin`):
  - tenant lifecycle
  - global integrations switches
  - SaaS governance
- Artist Workspace (`/studio`):
  - profile
  - integrations baseline
  - payment settings
  - pending migration of content modules to `/api/studio/*`

## 4. Architecture
### Frontend
- Next.js App Router
- public SSR pages + private client modules
- explicit UX split: public site vs private consoles

### Backend
- Supabase Postgres + Auth + Storage
- Next route handlers
- role-scoped guards in `proxy.ts`
- tenant auto-provisioning during register/OAuth callback

### Security baseline
- role-based route control (`platform_admin` vs artist operator)
- RLS + server-side privileged client for protected writes
- same-origin checks + rate limiting + honeypot
- CSP baseline and anti-fingerprinting controls

## 5. Current Roadmap Stage
- Phase 4: MVP hardening (active)
- Phase 7 bridge: platform/artist split stabilization (active)
- Next: migrate artist content modules (galleries/posts/homepage) from `/api/admin/*` to `/api/studio/*`

Reference: `docs/ROADMAP.md`

## 6. Source of Truth
- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/DEVLOG.md`
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `openspec/changes/admin-content-management/*`

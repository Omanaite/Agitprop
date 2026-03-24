# Master Document - Akemi Tattoo Portfolio

Date: 2026-03-24
Version: 2.0
Status: MVP hardening and production verification

## 1. Product Summary
Akemi Tattoo Portfolio is a tattoo artist web application that combines:
- a public portfolio and discovery experience
- operational admin tooling for content management
- a documented path toward configurable, optional post-MVP integrations

The product is intentionally finishing as a strong single-artist MVP before broader SaaS expansion.

## 2. MVP Definition
The MVP is complete only when:
- production deploy is confirmed on the latest commit
- public theme and locale switching work in production
- galleries and posts render correctly in production
- booking and contact flows work end-to-end
- admin login works with email/password and configured OAuth
- admin CRUD works in production
- registration works with email confirmation and OAuth sign-up
- baseline SEO/security hardening is active
- no blocking Vercel/Supabase issues remain

Reference: `docs/MVP_STATUS.md`

## 3. Current Product Scope
### Public
- homepage
- configurable homepage section order/naming/visibility
- gallery browsing and detail pages
- public posts feed
- booking and contact forms
- registration and locale preference
- theme switching

### Admin
- protected admin console
- gallery CRUD
- piece CRUD
- posts CRUD
- profile and integrations views
- homepage composition manager
- dedicated admin design system

## 4. Architecture
### Frontend
- Next.js App Router
- SSR/server-rendered public pages
- interactive admin client components
- distinct public vs admin UX systems

### Backend
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Next.js route handlers for privileged operations

### Security
- role-based admin gating
- RLS policies
- rate limiting
- same-origin enforcement
- honeypot anti-abuse fields
- CSP baseline
- reduced fingerprinting

### SEO
- metadata and canonical baseline
- sitemap and robots
- JSON-LD
- OG/Twitter images
- route-level descriptive copy improvements

## 5. MVP Readiness
### Stable locally
- lint/build/audit pass
- admin UI stable
- public UI stable
- registration and OAuth flows implemented
- locale and theme preference implemented

### Still requiring production confirmation
- latest deploy confirmation
- Supabase schema alignment
- OAuth production checks
- email delivery checks
- homepage composition persistence verification

Reference: `docs/PENDING_EXTERNAL_INTERVENTIONS.md`

## 6. Roadmap Summary
- Phase 0: discovery and scope
- Phase 1: SDD
- Phase 2: core admin
- Phase 3: extended content and operations
- Phase 4: MVP hardening and production verification
- Phase 5: MVP signoff
- Payments: after MVP signoff
- Post-MVP: SaaS expansion themes

Reference: `docs/ROADMAP.md`

## 7. Post-MVP Direction
Planned only after MVP acceptance:
- Stripe and PayPal sandbox validation
- appointment calendar and booking management
- email reminders
- WhatsApp notifications
- Google Calendar sync
- chatbot guidance and developer ticket routing
- artist-configurable feature toggles
- multi-tenant exploration

Reference: `docs/POST_MVP_BACKLOG.md`

## 8. Operational Rules
- Review skills before implementation.
- Persist context in Engram when available.
- Keep roadmap, state, and openspec aligned after significant changes.
- Keep external-provider requirements documented without blocking autonomous work.
- Do not release provider-dependent features without graceful fallback.

## 9. Key Files
- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/POST_MVP_BACKLOG.md`
- `docs/PRE_PROD_CHECKLIST.md`
- `openspec/changes/admin-content-management/design.md`
- `openspec/changes/admin-content-management/tasks.md`

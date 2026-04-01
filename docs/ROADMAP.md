# Project Roadmap: Agitprop (Akemi Pilot)

Date: 2026-03-31
Current status: Phase 4 + Phase 7 bridge (MVP hardening + SaaS role split stabilization)

## Executive Summary
Product: Agitprop, a Next.js + Supabase platform for artist websites and operations, currently running with Akemi as the pilot implementation.
Current objective: close MVP safely, verify production, and preserve a clear handoff path for post-MVP SaaS expansion.

## Phases

### Phase 0 - Discovery and Scope (Done)
- Inventory of existing capabilities.
- Primary use cases.
- Initial product scope and constraints.

### Phase 1 - Formal Specs / SDD (Done)
- SDD proposal, delta specs, design, and task breakdown.
- Internal quality rules, PR process, and security-review gate.

### Phase 2 - Core Admin Implementation (Done)
- Supabase admin auth.
- Protected admin routes.
- CRUD for galleries, pieces, and posts.
- Validation and consistent error messaging.
- Baseline RLS and storage model.

### Phase 3 - Extended Content and Operations (Done / Stabilized)
- Multiple galleries.
- Advanced gallery editor.
- Advanced post editor.
- Public posts feed.
- Public gallery listing and detail pages.
- Admin profile and integrations.
- Homepage composition controls.
- Public theme switching.
- Public locale switching (`en`, `es`, `de`).
- Separate admin design system.
- Headless UI admin navigation.
- Admin skeleton loading states.
- Neutral admin typography.
- Registration with email confirmation and OAuth sign-up.

### Phase 4 - MVP Hardening and Production Verification (Active)
- Production smoke testing.
- Final Supabase schema verification.
- Final OAuth / email flow verification.
- Final visual QA for admin and public experience.
- SEO and security hardening.
- Copy hardening before final indexation.
- Lighthouse pass and performance cleanup.
- Service page (`/agitprop`) validation for product narrative and signup funnel entry.

### Phase 5 - MVP Signoff (Pending)
- Confirm the latest deployed commit in Vercel.
- Confirm all MVP acceptance criteria in `docs/MVP_STATUS.md`.
- Close all required external interventions listed in `docs/PENDING_EXTERNAL_INTERVENTIONS.md`.
- Approve MVP as production-ready for the current single-artist product.

### Phase 6 - Payments Foundation (Sandbox) (Planned, can start after auth stability)
- Stripe checkout in test mode end-to-end.
- PayPal order flow in sandbox end-to-end.
- Admin payment settings menu for Stripe/PayPal references and mode (`test` / `live`).
- Provider fallback behavior if credentials are missing.
- Legal/compliance checklist before switching to live payments.

### Phase 7 - SaaS Foundation (Planned)
- Developer SaaS admin workspace (platform-level controls).
- Artist auto-provisioning on account creation.
- Artist page activation/deactivation by platform admin.
- Platform admin operations for artist pages:
  - activate/deactivate artist site
  - edit artist metadata and plan
  - soft-delete / hard-delete artist tenant with audit trail
- Explicit console separation:
  - Platform Admin Console (SaaS governance only)
  - Artist Workspace (content + site operations)
- Platform admin must not manage artist content directly (no posts/galleries/homepage editor in platform console).
- Platform admin controls:
  - roles and permissions
  - global integration availability (maintenance switch)
  - plan feature bundles by tenant
- First implementation status:
  - platform console route in place (`/admin`)
  - artist workspace route in place (`/studio`)
  - role-based routing and access guard wired
  - platform governance APIs in place for tenant lifecycle baseline and global integration toggles
  - tenant auto-provisioning wired into registration and OAuth callback
  - artist workspace now uses artist-scoped settings APIs (`/api/studio/profile`, `/api/studio/payment-settings`) instead of platform admin endpoints
  - artist integrations baseline now available at `/api/studio/integrations` and connected to OAuth flow via `/api/auth/oauth`
  - artist content modules now migrated to `/api/studio/*` routes (galleries, pieces, posts, homepage composition, uploads)
  - ownership-isolation hardening in progress: studio content routes now enforce `owner_user_id` scoping with SQL patch requirement tracking
  - platform tenant lifecycle baseline expanded: create/delete operations now available in platform admin governance module
- Plan model:
  - free plan with limited feature set
  - premium plan with full feature set
- Theme model:
  - free plan: 3 selectable default styles
  - Akemi pilot: premium + custom brutalist style (email anchor: `akemi@tattoo.ink`)
- Feature-flag architecture per artist account.

### Phase 7.5 - Product Marketing Surface (Planned / In Progress)
- Build dedicated service page for Agitprop value proposition.
- Explain Free vs Premium clearly for conversion.
- Add direct CTAs to registration, login, and pilot public site.
- Define SEO baseline for service page intent ("tattoo website builder", "artist booking software").
- Add instrumentation plan for conversion tracking (view -> register -> first login).

### Phase 8 - Scheduling and Availability (Planned)
- New menu: **Scheduling & Availability**.
- Artist calendar view of bookings.
- Availability slots by weekday/time windows.
- Customer booking limited to available slots.
- Admin schedule board for booked/pending/reschedule states.
- Extension hooks for reminders, WhatsApp, and Google Calendar sync.

### Post-MVP - Product Expansion / SaaS Direction (Planned)
- Multi-artist / multi-tenant evolution.
- Sandbox-first Stripe and PayPal validation.
- Calendar management for appointments.
- Email reminders and artist notifications.
- Optional WhatsApp notification when bookings are created.
- Google Calendar sync for accepted appointments.
- Chatbot for site guidance and developer ticket escalation.
- Per-feature toggles so the artist can enable or disable integrations safely.
- Platform admin can activate/deactivate artist pages.
- Free vs premium plan enforcement with feature gating.

## Deliverables by Phase
- P0: `docs/ROADMAP.md`, `docs/PROJECT_OVERVIEW.md`
- P1: `openspec/changes/admin-content-management/*`
- P2: protected admin panel + CRUD APIs + RLS
- P3: advanced content tooling + composition controls + locale controls + registration
- P4: production verification + SEO/security hardening + QA
- P4.1: service page + signup funnel entrypoint
- P5: MVP signoff package

## Known Blockers
- Requires production verification in Vercel and Supabase before declaring MVP complete.
- Requires working third-party configuration for OAuth and email flows.
- Requires final editorial review for public SEO-facing content.
- Post-MVP integrations will require provider credentials and business rules.

## Current Roadmap Focus
1. Keep the current MVP stable.
2. Document all user-dependent actions without blocking autonomous work.
3. Avoid starting provider-dependent integrations before MVP signoff.
4. Preserve a safe path toward optional, configurable post-MVP modules.
5. Keep Agitprop service narrative clear while preserving Akemi pilot brand identity.
6. Enforce documentation persistence protocol so context survives compaction/handoff (`docs/ENGINEERING_CONTEXT.md`).

## Update 2026-03-26
- Fixed broken public image rendering caused by overly strict Next image host restrictions.
- Restored gallery single-file and bulk-file upload usability in admin by removing unintended integration-based disable logic.

## Audit Follow-up Backlog
Source of record: `docs/reports/akemi-seo-security-audit-2026-03-24.pdf`
- [x] Canonical metadata baseline.
- [x] Social metadata / OG / Twitter images.
- [x] Sitemap and robots.
- [x] JSON-LD baseline.
- [x] Public payload trimming.
- [x] Anti-abuse normalization.
- [x] Powered-by fingerprint reduction.
- [ ] Final placeholder / low-trust copy replacement before indexation.
- [ ] Additional CSP tightening without breaking Next/Vercel runtime.
- [ ] Route-based multilingual SEO strategy beyond cookie-only locale switching.
- [ ] Final Lighthouse pass after production verification.

## MVP Context
- MVP status and acceptance gate: `docs/MVP_STATUS.md`
- User-dependent items: `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- Post-MVP expansion backlog: `docs/POST_MVP_BACKLOG.md`
- Production readiness checklist: `docs/PRE_PROD_CHECKLIST.md`



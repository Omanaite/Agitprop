# State Snapshot - Agitprop (Akemi Pilot)

Date: 2026-03-24
Branch target: `vercel`

## Purpose
Keep one current snapshot of implementation state, blockers, and next actions so the project does not depend on chat memory.

## Current Status
- Admin CMS is implemented and stable locally.
- Public site supports themes (`light`, `eye`, `dark`).
- Public site supports locale preference (`en`, `es`, `de`).
- Registration supports email confirmation and OAuth sign-up.
- Admin login supports email/password and OAuth.
- Homepage composition is configurable from admin.
- SEO baseline and first security hardening pass are in place.
- Local quality gates pass:
  - `npm run lint`
  - `npm run build`
  - `npm audit`
- Formal MVP, handoff, and post-MVP backlog documents now exist.
- Payments settings module added in admin (API + UI), pending schema rollout in production.
- Public service page `/agitprop` added as product-marketing entrypoint with direct signup/login CTAs.
- Role-scoped private surfaces are now bootstrapped:
  - `/admin` for platform governance
  - `/studio` for artist operations
- Platform governance baseline now implemented:
  - tenant lifecycle API surface
  - global integration toggle API surface
- Tenant auto-provisioning baseline implemented in auth flows (register + OAuth callback).

## What Is Stable Locally
- Gallery CRUD.
- Piece CRUD.
- Posts CRUD.
- Admin profile and integrations UI.
- Public galleries and gallery detail.
- Public posts feed.
- Booking flow.
- Contact flow.
- Registration flow.
- Locale preference persistence.
- Theme switching.
- Product marketing page for Agitprop service narrative.

## What Still Depends on Production / External Verification
- Latest Vercel deploy confirmation.
- Latest Supabase schema confirmation in target environment.
- Production smoke test for admin and public flows.
- OAuth production verification.
- Email delivery verification.
- Final public content / SEO copy approval.

## Recent Key Changes
- Fixed production image rendering regressions by broadening remote image host support in Next image config.
- Removed unintended integration-gating from gallery file inputs so single and bulk uploads remain usable with Supabase Storage.
- Added formal MVP status tracking.
- Added explicit external-intervention handoff file.
- Added post-MVP SaaS/backlog record.
- Added SEO baseline (metadata, sitemap, robots, JSON-LD, social images).
- Added locale server-side cookie persistence.
- Added anti-abuse normalization on public write flows.
- Added homepage composition fallback behavior and guarded save path.
- Added edit-form focus/scroll improvements in admin.
- Added admin-neutral typography and distinct admin visual system.
- Added Agitprop service page foundation for onboarding and conversion flow.

## High-Priority Pending Work
- Fix production auth instability (OAuth + admin role checks + profile/integrations schema alignment).
- Validate service-page SEO and conversion flow (`/agitprop` -> `/register` -> `/admin/login`).
- Run production smoke test and check Vercel logs.
- Verify `homepage_sections` is fully active in production.
- Confirm OAuth flows in production.
- Confirm booking/contact/registration email delivery.
- Replace any remaining low-trust public copy before final indexation.
- Tighten CSP further without breaking runtime behavior.
- Define route-based multilingual SEO strategy.
- Complete final admin/public visual QA.
- Validate MVP acceptance against `docs/MVP_STATUS.md`.
- Expand role boundary from route level into full data-level tenancy and permission model.
- Apply latest Supabase schema to production for tenant governance tables.

## New Backlog Registered (Platform / SaaS)
- Platform-level SaaS admin workspace.
- Auto-provision artist site on account creation.
- Free plan (limited features) vs premium plan (full features).
- Akemi pilot as premium with custom brutalist style.
- New artist scheduling module: `Scheduling & Availability`.
- Booking bound to artist availability windows.
- Platform admin scope refinement:
  - manage tenants, plans, roles, lifecycle
  - do not own artist content modules (posts/galleries/homepage)

## Medium-Priority Pending Work
- Deeper localization of admin-managed labels.
- Final documentation sweep for NotebookLM/PDF export.
- Optional automated test foundation after MVP signoff.

## Files That Matter Most Right Now
- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/POST_MVP_BACKLOG.md`
- `docs/PRE_PROD_CHECKLIST.md`
- `openspec/changes/admin-content-management/design.md`
- `openspec/changes/admin-content-management/tasks.md`

## Rules in Effect
- Review `C:\GitHub\akemi\.atl\skill-registry.md` before implementation.
- Persist context in Engram when available.
- Use prefixed commits.
- No PR is eligible for merge without satisfying internal manual security review requirements.
- External-provider features must degrade safely when not configured.





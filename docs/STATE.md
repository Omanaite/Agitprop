# State Snapshot - Agitprop (Akemi Pilot)

Date: 2026-04-02
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
- Tenant public sites (`/{slug}`) with owner-isolated content and theme entitlement.
- Tenant gallery detail pages (`/{slug}/gallery/{gallerySlug}`) with owner isolation.

## What Still Depends on Production / External Verification
- Latest Vercel deploy confirmation.
- Latest Supabase schema confirmation in target environment.
- Production smoke test for admin and public flows.
- OAuth production verification.
- Email delivery verification.
- Final public content / SEO copy approval.
- Apply `ARTIST_SITE_THEMES_PATCH.sql` in Supabase prod/preview to activate `site_theme` and `custom_domain` columns.
- Set `NEXT_PUBLIC_PLATFORM_HOST` env var in Vercel for custom domain resolution to function correctly.

## MVP Closure Batch (2026-04-02)
- Registration: auto-confirm email via service role — no SMTP dependency.
- Registration: success state shows direct link to studio login.
- Studio login: new `signInArtist` action — errors redirect to `/studio/login`, not `/admin/login`.
- StudioBookingsManager: friendlier schema-pending notice.
- Register page / complete page: updated copy to reflect instant access.
- Removed chandiapablo from admin allowlist — only pchandia@hotmail.com remains.
- Studio Console: removed Integrations and Payments tabs (not MVP-ready).
- StudioSiteSettings: `akemi_brutalist` now labeled "Custom".
- Artist logout: redirects to `/agitprop` instead of `/admin/login`.

## SQL Patches Still Pending in Production
- `BOOKINGS_TENANT_ISOLATION_PATCH.sql` — adds `owner_user_id` to bookings table.
- `ARTIST_SITE_THEMES_PATCH.sql` — adds `site_theme`, `custom_domain` columns to artist_tenants.
- `STUDIO_TENANT_OWNERSHIP_PATCH.sql` — adds ownership filtering to studio content.

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
- Added artist-scoped settings APIs (`/api/studio/profile`, `/api/studio/payment-settings`) and wired studio workspace settings tabs to avoid platform-admin API coupling.
- Added artist-scoped integrations API (`/api/studio/integrations`) and wired studio OAuth connect path to `/api/auth/oauth` with studio callback intent.
- Added artist-scoped content API baseline (`/api/studio/galleries`, `/api/studio/gallery-items`, `/api/studio/posts`, `/api/studio/homepage-sections`, `/api/studio/uploads`) and wired studio content tabs to those routes.
- Added ownership filtering (`owner_user_id`) on studio content APIs; rollout SQL patch prepared at `docs/sql/STUDIO_TENANT_OWNERSHIP_PATCH.sql`.
- Expanded platform-governance module with tenant create/delete controls backed by API (`POST/DELETE /api/admin/platform-tenants`).
- Updated SaaS entrypoint routing:
  - `/` redirects to `/studio/login`
  - pilot public site served from `/akemi`
- Added tenant public slug route foundation (`/{slug}`) for artist-isolated sites.
- Added tenant theme policy foundation:
  - allowed defaults for non-Akemi: `atelier`, `mono`, `ink`
  - reserved premium pilot theme: `akemi_brutalist`
- Added tenant theme entitlement policy with centralized sanitizer (`lib/tenants/theme.ts`), `site_theme`/`custom_domain` DB fields, SQL patch (`docs/sql/ARTIST_SITE_THEMES_PATCH.sql`), sitemap tenant slug inclusion, platform admin UI for theme/domain, and per-tenant SEO/canonical metadata.
- Added tenant gallery detail route (`/{slug}/gallery/{gallerySlug}`) with owner isolation; fixed cross-route gallery link bug in slug page; extended proxy with custom domain resolution (non-platform hostnames rewritten to `/{slug}`).

## High-Priority Pending Work
- Fix production auth instability (OAuth + admin role checks + profile/integrations schema alignment).
- Validate service-page SEO and conversion flow (`/agitprop` -> `/register` -> `/admin/login`).
- Run production smoke test and check Vercel logs.
- Verify `homepage_sections` is fully active in production.
- Apply latest tenant theme/domain schema patch in production Supabase.
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
- `docs/ENGINEERING_CONTEXT.md`
- `openspec/changes/admin-content-management/design.md`
- `openspec/changes/admin-content-management/tasks.md`

## Rules in Effect
- Review `C:\GitHub\akemi\.atl\skill-registry.md` before implementation.
- Persist context in Engram when available.
- Use prefixed commits.
- No PR is eligible for merge without satisfying internal manual security review requirements.
- External-provider features must degrade safely when not configured.





# Devlog

Purpose: chronological project progress log to preserve context across sessions.

## 2026-03-24
- Formalized MVP signoff documents:
  - `docs/MVP_STATUS.md`
  - `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
  - `docs/POST_MVP_BACKLOG.md`
- Refreshed project docs for continuity (`ROADMAP`, `STATE`, `MASTER_DOCUMENT`, `NOTEBOOKLM`).

## 2026-03-26
- Fixed public image regressions by broadening remote host support for Next image.
- Restored admin gallery single and bulk file uploads by removing unintended integration-based disable state.

## 2026-03-31
- Fixed OAuth button navigation behavior by switching provider CTA to standard anchor navigation (prevents Next API prefetch query noise).
- Added resilient admin auth check via shared helper (`role`, `roles`, and optional allowlist support).
- Added safe fallbacks in profile/integrations APIs when production schema is missing (`admin_profiles`, `admin_integrations`) to avoid hard 500 failures.
- Added `admin_payment_settings` API + admin UI section for Stripe/PayPal references and operation mode (`test/live`).
- Extended `supabase/schema.sql` with:
  - `admin_profiles`
  - `admin_integrations`
  - `admin_payment_settings`
  - RLS + admin policies for those tables.
- Registered new roadmap items for:
  - payments sandbox progression
  - SaaS foundation (platform admin, plan gating)
  - scheduling and availability module.
- Started product rebrand from project-level naming to **Agitprop** while preserving Akemi as pilot tenant.
- Added new public service route `/agitprop` with:
  - value proposition blocks
  - Free vs Premium framing
  - CTA flow to `/register`, `/admin/login`, and pilot homepage.
- Updated roadmap/spec artifacts to include service-page conversion funnel and pending SEO/localization tasks for this surface.

## 2026-03-31 (follow-up)
- Hardened `GET /api/admin/profile` to avoid hard 500 for recoverable schema/policy drift:
  - removed strict dependency on `id` column in select projection
  - added fallback behavior for missing-column / privilege mismatch cases
- Added SaaS foundation backlog item for full artist-tenant lifecycle controls in platform admin:
  - edit
  - activate/deactivate
  - delete with audit trail

## 2026-03-31 (platform scope clarification)
- Registered product decision: split current mixed admin into two role-scoped consoles.
  - Platform Admin Console (SaaS operations)
  - Artist Workspace (content/site management)
- Recorded that platform admin should not directly manage artist content modules:
  - homepage
  - posts
  - galleries
  - pieces
- Added platform-governance requirements:
  - role and permission management
  - tenant lifecycle controls
  - global integration enable/disable switches for maintenance windows

## 2026-03-31 (role-scoped console implementation)
- Implemented first UI split:
  - `/admin` now serves Platform Admin Console scope only.
  - `/studio` now serves artist content workspace.
- Updated auth routing:
  - login redirects users to role-appropriate console (`/admin` or `/studio`).
  - proxy enforces route access by role and prevents cross-scope access.
- Kept platform console intentionally free of artist content modules to align with SaaS governance model.

## 2026-03-31 (platform governance foundation)
- Added SaaS schema foundation in `supabase/schema.sql`:
  - `artist_tenants`
  - `tenant_memberships`
  - `platform_integrations`
- Added platform admin APIs:
  - `GET/PUT /api/admin/platform-tenants`
  - `GET/PUT /api/admin/platform-integrations`
- Added platform governance UI module in platform console for:
  - tenant status and plan control
  - global integration maintenance switches

## 2026-03-31 (tenant auto-provisioning)
- Added tenant bootstrap service (`lib/tenants/provision.ts`).
- Registration and OAuth callback now attempt to provision tenant records automatically for non-platform users:
  - create tenant in `artist_tenants`
  - create owner membership in `tenant_memberships` with `artist_admin` role
- Provisioning failures are intentionally non-blocking for auth flow continuity.
- Added reusable SQL patch at `docs/sql/SAAS_FOUNDATION_PATCH.sql` for idempotent rollout in Supabase.

## 2026-03-31 (artist login visibility)
- Added dedicated artist login route: `/studio/login`.
- Updated proxy behavior so unauthenticated `/studio/*` requests redirect to `/studio/login`.
- Updated service page CTAs to expose:
  - Artist login (`/studio/login`)
  - Platform admin login (`/admin/login`)
- Updated registration policy:
  - register page now supports email/password only
  - OAuth entry moved to artist login to avoid duplicate sign-up surfaces

## 2026-03-31 (oauth documentation)
- Added `docs/OAUTH_GOOGLE_SETUP.md` with:
  - required Google redirect URI for Supabase callback
  - Supabase provider and URL configuration checklist
  - smoke-test steps
  - security guidance for client secret handling/rotation

## 2026-03-31 (studio 403 hotfix)
- Fixed artist workspace 403 noise by removing direct dependency on `/api/admin/*` endpoints from `/studio`.
- Added `StudioWorkspaceShell` as transition-safe role-scoped surface while artist-scoped API layer is implemented.


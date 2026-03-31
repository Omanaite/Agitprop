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

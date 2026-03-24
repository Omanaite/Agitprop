# State Snapshot - Akemi Tattoo Portfolio

Date: 2026-03-20
Branch target: vercel

## Purpose
Keep a single, persistent summary of project status, decisions, pending work, and production steps to avoid depending on chat context.

## Current Status
- Admin CMS: login + CRUD for galleries, pieces (tattoos), and posts implemented.
- Public site: gallery, gallery list with detail, published posts, contact, bookings, payments.
- Security: RLS, rate limiting, API validation, origin checks, CSP in prod.
- Themes: light, dark, eye (eye rest).
- Documentation: roadmap, admin manual, validation UX, security, SDLC, PR process.
- Engram: active in Codex (config in AppData\Roaming\codex\config.toml).
- Local dependency baseline updated to Next.js 16.2.1 with clean `npm audit`.
- Local `npm run lint` and `npm run build` both pass on the current branch.

## Recent Key Changes
- proxy.ts active (middleware migration) for Next 16.
- TypeScript build fixes in lib/supabase/ssr.ts.
- Admin UX: guided flow in galleries/pieces, quick required-field validation.
- Posts: preview + scheduled publishing and UI validation.
- Admin console navigation: single active section + dropdown.
- UI copy migrated to English.
- Admin visual system separated from the public brutalist portal.
- Headless UI navigation and route-level skeleton loading added to admin.
- Responsive QA pass completed for the current admin design system.
- Homepage composition is now admin-managed for order, section naming,
  eyebrow text, and visibility.
- Public header navigation now follows visible configured homepage sections.
- Public locale preference is now persisted with a lightweight selector and
  server-rendered locale-aware homepage copy for English, Spanish, and German.
- Admin now uses a neutral operations-oriented font stack separate from the
  public brutalist typography.
- Homepage composition save is now automatically disabled during production
  schema fallback so admins are not exposed to failing writes.
- Gitignore: engram/ ignored to avoid build failures.
- Gallery filter contrast is now hardened for native dropdown rendering in dark mode.
- Admin OAuth buttons now include provider iconography with theme-aware presentation.
- Registration flow now exists with email confirmation and OAuth sign-up.
- Edit actions now move focus and scroll to the active form on mobile and desktop.
- SEO baseline now includes metadata, sitemap, robots, and structured data.
- Open Graph / Twitter image generation now exists for the home page and gallery detail routes.
- Public gallery and post imagery now use `next/image` in the first performance pass.
- Audit report `docs/reports/akemi-seo-security-audit-2026-03-24.pdf` reviewed and converted into tracked remediation backlog.
- Canonical metadata baseline implemented on current public routes.
- Locale preference cookie now writes server-side with production-aware attributes.
- Homepage and gallery routes now use stronger route-specific SEO descriptions.
- Gallery detail pages now render stronger standalone context for search and users.
- Public homepage tattoo queries now request only fields needed for rendering.
- Booking, contact, and registration flows now include honeypot anti-abuse checks.
- `X-Powered-By` fingerprinting is disabled via Next config.
- Register/admin auth routes are now marked `noindex`.
- Public empty states were upgraded to remove lower-trust placeholder language.

## Current Blocker (Vercel)
None reported after latest redeploys, but keep verifying the build uses the latest commit.

## Pending Tasks (High Priority)
- Confirm clean Vercel deploy on latest commit.
- Final UX/UI sweep (admin + client) per validation guide.
- Pre-prod checklist + manual testing.
- Complete deeper localization for admin-managed custom section labels.
- Final admin typography QA sweep after neutral font rollout.
- Lighthouse QA pass and performance fixes.
- Add canonical tags on public routes.
- Improve SEO copy quality and route-specific descriptions.
- Replace remaining placeholder/low-trust public copy before enabling final indexation.
- Tighten CSP further by removing remaining inline allowances where feasible.
- Harden CSP and narrow broad source allowances over time.
- Plan route-based multilingual SEO beyond cookie-only locale switching.
- Standardize locale cookie production attributes.

## Pending Tasks (Medium)
- Full English copy audit in docs and remaining strings.
- Final accessibility adjustments (focus, aria-live, touch sizes).

## Production Runbook (Summary)
1. Verify env vars in Vercel: SUPABASE, RESEND, STRIPE, PAYPAL.
2. Deploy branch `vercel` with latest commit.
3. Manual tests:
   - Admin login
   - Galleries CRUD
   - Pieces CRUD + ordering
   - Posts CRUD + preview
   - Public site: galleries, detail, posts, contact, booking, payments
4. Validate error logs (Vercel + Supabase).

## Key Files
- Admin UI: components/admin/GalleryManager.tsx, GalleriesManager.tsx, PostManager.tsx
- API: app/api/admin/*, app/api/bookings, app/api/contact
- Data: lib/data/*
- Homepage composition: lib/data/homepage-sections.ts, app/api/admin/homepage-sections/route.ts
- Locale system: lib/i18n.ts, lib/request-locale.ts, components/PublicLocaleToggle.tsx
- Pre-prod runbook: docs/PRE_PROD_CHECKLIST.md
- Security: lib/security.ts, lib/rate-limit.ts, docs/SECURITY_REVIEW.md
- Specs: openspec/changes/admin-content-management/*

## Key Decisions
- Admin auth with Supabase Auth + app_metadata.role=admin.
- RLS applied on all tables.
- Storage bucket: gallery (public read, admin write).
- Commit standard with prefixes (feat, fix, docs, chore).
- Skills review is mandatory before implementation, using `C:\GitHub\akemi\.atl\skill-registry.md` as the preflight registry.
- Engram should be used to preserve task context and active-skill context whenever available.

# State Snapshot - Akemi Tattoo Portfolio

Date: 2026-03-15
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

## Recent Key Changes
- proxy.ts active (middleware migration) for Next 16.
- TypeScript build fixes in lib/supabase/ssr.ts.
- Admin UX: guided flow in galleries/pieces, quick required-field validation.
- Posts: preview + scheduled publishing and UI validation.
- Admin console navigation: single active section + dropdown.
- UI copy migrated to English.
- Gitignore: engram/ ignored to avoid build failures.

## Current Blocker (Vercel)
None reported after latest redeploys, but keep verifying the build uses the latest commit.

## Pending Tasks (High Priority)
- Confirm clean Vercel deploy on latest commit.
- Final UX/UI sweep (admin + client) per validation guide.
- Pre-prod checklist + manual testing.

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
- Security: lib/security.ts, lib/rate-limit.ts, docs/SECURITY_REVIEW.md
- Specs: openspec/changes/admin-content-management/*

## Key Decisions
- Admin auth with Supabase Auth + app_metadata.role=admin.
- RLS applied on all tables.
- Storage bucket: gallery (public read, admin write).
- Commit standard with prefixes (feat, fix, docs, chore).

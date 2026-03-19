# Tasks: Admin Content Management

## Phase 1: Foundation
- [x] 1.1 Update `supabase/schema.sql` to add `posts` table and RLS policies.
- [x] 1.2 Add admin auth helper utilities in `lib/supabase/server.ts` (session validation).
- [x] 1.3 Add validation schemas for admin payloads in `lib/validators.ts`.

## Phase 2: Core Implementation
- [x] 2.1 Create admin API routes in `app/api/admin/gallery/route.ts` for CRUD.
- [x] 2.2 Create admin API routes in `app/api/admin/posts/route.ts` for CRUD.
- [x] 2.3 Implement storage upload handler (if using Supabase Storage) in `app/api/admin/uploads/route.ts`.

## Phase 3: Integration / UI
- [x] 3.1 Create admin routes in `app/admin/page.tsx` and related layout for auth guard.
- [x] 3.2 Implement gallery management UI components in `components/admin/GalleryManager.tsx`.
- [x] 3.3 Implement post management UI components in `components/admin/PostManager.tsx`.
- [x] 3.4 Wire admin UI to API routes with form validation and feedback.

## Phase 4: Testing / Verification
- [ ] 4.1 Add unit tests for new validation schemas in `lib/validators.ts`.
- [ ] 4.2 Add integration tests for admin API routes (CRUD scenarios).
- [ ] 4.3 Add manual test checklist for admin flow in `docs/ADMIN_MANUAL.md`.

## Phase 5: Security Review
- [x] 5.1 Run a security review against OWASP Top 10 for admin routes and public APIs.
- [x] 5.2 Verify RLS policies for admin vs public access.
- [x] 5.3 Validate secret handling (env vars) and ensure no client exposure.

## Phase 6: Documentation
- [x] 6.1 Update `docs/ADMIN_MANUAL.md` with final UI flow and screenshots.
- [x] 6.2 Update `docs/PROJECT_OVERVIEW.md` with admin feature summary.
- [x] 6.3 Update `docs/NOTEBOOKLM.md` with finalized admin workflow and security notes.
- [x] 6.4 Update `docs/VALIDATION_UX.md` when new fields or forms are added.
- [x] 6.5 Record commit message standard in design docs (prefixed messages).

## Phase 7: UX Enhancements
- [x] 7.1 Add dark mode toggle (persist preference).
- [x] 7.2 Add eye-rest mode: warm/yellow tint for light mode.
- [x] 7.3 Document theme modes in `docs/ADMIN_MANUAL.md` and `docs/PROJECT_OVERVIEW.md`.

## Phase 8: Public Content + Advanced Editors
- [x] 8.1 Add public posts feed to home page.
- [x] 8.2 Add public galleries listing to home page.
- [x] 8.3 Build advanced gallery editor (bulk upload, drag/drop reorder, tagging).
- [x] 8.4 Build advanced post editor (draft/publish, preview, scheduling).
- [x] 8.5 Extend tattoo metadata (style, location link, session length).

## Phase 9: Admin Profile + OAuth + Cloud
- [x] 9.1 Define schema for admin profile (email, nickname, billing/shipping addresses, payment metadata).
- [x] 9.2 Add admin profile UI and API routes.
- [x] 9.3 Add OAuth provider configuration plan (Google/GitHub/Facebook).
- [x] 9.4 Add cloud storage connection model and UI gating (enable uploads only when connected).
- [x] 9.5 Update docs and specs for profile + OAuth + cloud.

## Phase 12: Admin Design System
- [x] 12.1 Define a separate admin UI/UX direction independent from the public portal.
- [x] 12.2 Add Headless UI navigation primitives for the admin workspace.
- [x] 12.3 Add skeleton loading states for admin login and admin dashboard routes.
- [x] 12.4 Expose theme controls in admin login and admin console.
- [ ] 12.5 Complete responsive QA pass for mobile/tablet/desktop admin views.
- [x] 12.6 Update roadmap, architecture, and specs for the admin design system.

## Phase 10: SEO + Quality
- [ ] 10.1 Add OpenGraph metadata and social previews.
- [ ] 10.2 Add sitemap and robots.
- [ ] 10.3 Add schema.org structured data.
- [ ] 10.4 Lighthouse QA pass and performance fixes.

## Phase 11: Payments (Final)
- [ ] 11.1 Implement payments (Stripe/PayPal) after QA signoff.
- [ ] 11.2 Add webhook handling and audit logging.
- [ ] 11.3 Add admin profile payment settings.

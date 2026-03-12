# Tasks: Admin Content Management

## Phase 1: Foundation
- [ ] 1.1 Update `supabase/schema.sql` to add `posts` table and RLS policies.
- [ ] 1.2 Add admin auth helper utilities in `lib/supabase/server.ts` (session validation).
- [ ] 1.3 Add validation schemas for admin payloads in `lib/validators.ts`.

## Phase 2: Core Implementation
- [ ] 2.1 Create admin API routes in `app/api/admin/gallery/route.ts` for CRUD.
- [ ] 2.2 Create admin API routes in `app/api/admin/posts/route.ts` for CRUD.
- [ ] 2.3 Implement storage upload handler (if using Supabase Storage) in `app/api/admin/uploads/route.ts`.

## Phase 3: Integration / UI
- [ ] 3.1 Create admin routes in `app/admin/page.tsx` and related layout for auth guard.
- [ ] 3.2 Implement gallery management UI components in `components/admin/GalleryManager.tsx`.
- [ ] 3.3 Implement post management UI components in `components/admin/PostManager.tsx`.
- [ ] 3.4 Wire admin UI to API routes with form validation and feedback.

## Phase 4: Testing / Verification
- [ ] 4.1 Add unit tests for new validation schemas in `lib/validators.ts`.
- [ ] 4.2 Add integration tests for admin API routes (CRUD scenarios).
- [ ] 4.3 Add manual test checklist for admin flow in `docs/ADMIN_MANUAL.md`.

## Phase 5: Security Review
- [ ] 5.1 Run a security review against OWASP Top 10 for admin routes and public APIs.
- [ ] 5.2 Verify RLS policies for admin vs public access.
- [ ] 5.3 Validate secret handling (env vars) and ensure no client exposure.

## Phase 6: Documentation
- [ ] 6.1 Update `docs/ADMIN_MANUAL.md` with final UI flow and screenshots.
- [ ] 6.2 Update `docs/PROJECT_OVERVIEW.md` with admin feature summary.
- [ ] 6.3 Update `docs/NOTEBOOKLM.md` with finalized admin workflow and security notes.
- [ ] 6.4 Update `docs/VALIDATION_UX.md` when new fields or forms are added.

## Phase 7: UX Enhancements
- [ ] 7.1 Add dark mode toggle (persist preference).
- [ ] 7.2 Add eye-rest mode: warm/yellow tint for light mode.
- [ ] 7.3 Document theme modes in `docs/ADMIN_MANUAL.md` and `docs/PROJECT_OVERVIEW.md`.

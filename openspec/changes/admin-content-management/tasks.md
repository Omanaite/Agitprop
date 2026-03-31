# Tasks: Admin Content Management

## Phase 1: Foundation
- [x] 1.0 Review relevant skills from `C:\GitHub\akemi\.atl\skill-registry.md` before implementation.
- [x] 1.0.1 Persist working context in Engram when available.
- [x] 1.1 Update `supabase/schema.sql` to add `posts` table and RLS policies.
- [x] 1.2 Add admin auth helper utilities in `lib/supabase/server.ts` (session validation).
- [x] 1.3 Add validation schemas for admin payloads in `lib/validators.ts`.

## Phase 2: Core Implementation
- [x] 2.1 Create admin API routes in `app/api/admin/gallery-items/route.ts` for CRUD.
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
- [x] 4.3 Add manual test checklist for admin flow in `docs/ADMIN_MANUAL.md`.

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
- [x] 12.5 Complete responsive QA pass for mobile/tablet/desktop admin views.
- [x] 12.6 Update roadmap, architecture, and specs for the admin design system.
- [x] 12.7 Fix contrast of selected-work filter option text across theme modes.
- [x] 12.8 Add theme-aware OAuth icons to admin login providers.
- [x] 12.9 Move focus and scroll to the active edit form when admin editing begins.

## Phase 10: SEO + Quality
- [x] 10.1 Add OpenGraph metadata and social previews.
- [x] 10.2 Add sitemap and robots.
- [x] 10.3 Add schema.org structured data.
- [ ] 10.4 Lighthouse QA pass and performance fixes.
- [x] 10.5 Add canonical metadata for public routes.
- [x] 10.6 Improve route-level SEO descriptions and search-oriented copy.
- [ ] 10.7 Replace placeholder / low-trust public copy before final indexation.
- [x] 10.8 Expand gallery detail pages with stronger standalone ranking content.
- [x] 10.9 Review public payload size and trim non-essential data.
- [ ] 10.10 Tighten CSP and reduce broad inline / connection allowances.
- [x] 10.11 Reduce stack fingerprinting where feasible in production responses.
- [x] 10.12 Normalize abuse protection across all public write endpoints.
- [ ] 10.13 Plan route-based multilingual SEO and production cookie hardening.

## Phase 13: Public Composition + Localization
- [x] 13.1 Define schema/model for configurable homepage sections (key, label, order, visibility).
- [x] 13.2 Add admin UI for section ordering and section renaming.
- [x] 13.3 Update public homepage rendering to consume configured section order and labels.
- [x] 13.4 Add locale model and preference handling for German, English, and Spanish.
- [x] 13.5 Add public language selector with persistent preference.
- [ ] 13.6 Localize public UI copy and admin-controlled section labels.
- [x] 13.7 Update roadmap, design, specs, and manuals for public composition + i18n.

## Phase 14: Registration Flow
- [x] 14.1 Define registration UX for email/password sign-up with email confirmation.
- [x] 14.2 Add OAuth sign-up entry points aligned with the admin/public auth model.
- [x] 14.3 Document registration flow, confirmation states, and guardrails.

## Phase 11: Payments (Final)
- [ ] 11.1 Implement payments (Stripe/PayPal) after QA signoff.
- [ ] 11.2 Add webhook handling and audit logging.
- [ ] 11.3 Add admin profile payment settings.

## Phase 15: MVP Signoff Preparation
- [ ] 15.1 Validate `docs/MVP_STATUS.md` against the deployed production build.
- [ ] 15.2 Close or confirm each item in `docs/PENDING_EXTERNAL_INTERVENTIONS.md`.
- [ ] 15.3 Record final smoke-test results in `docs/PRE_PROD_CHECKLIST.md`.

## Phase 16: Post-MVP Discovery Backlog
- [ ] 16.1 Design sandbox-first Stripe and PayPal rollout after MVP signoff.
- [ ] 16.2 Design appointment calendar + reminder architecture with graceful degradation.
- [ ] 16.3 Design optional WhatsApp, Google Calendar, and chatbot modules behind artist-controlled feature toggles.
- [ ] 16.4 Document SaaS / multi-tenant exploration boundaries before implementation.

## Phase 17: Payments Sandbox Hardening
- [x] 17.1 Add admin payment settings API and UI section for Stripe/PayPal references.
- [ ] 17.2 Wire payment settings into checkout behavior for tenant-aware routing.
- [ ] 17.3 Add payment webhook audit flow and replay-safe handling.
- [ ] 17.4 Publish legal/compliance checklist before moving from test to live mode.

## Phase 18: SaaS Pilot Foundation
- [ ] 18.1 Define platform admin model for developer-level control of artist pages.
- [ ] 18.2 Add artist provisioning model for new registrations (free plan defaults).
- [ ] 18.3 Add feature gating model for free vs premium capabilities.
- [ ] 18.4 Reserve pilot mapping for `akemi@tattoo.ink` as premium with custom brutalist style.
- [ ] 18.5 Design `Scheduling & Availability` domain for artist slot management and booking constraints.
- [ ] 18.6 Add platform-admin actions for artist tenant lifecycle (edit, activate/deactivate, delete with audit).
- [ ] 18.7 Split current admin UI into:
  - platform admin console (SaaS governance)
  - artist workspace (content and artist operations)
- [ ] 18.8 Remove artist modules from platform admin:
  - homepage
  - galleries
  - pieces
  - posts
  - artist-level integrations
- [ ] 18.9 Add platform-level role/permission module:
  - grant/revoke artist roles
  - grant/revoke staff roles
  - assign feature bundles by plan

## Phase 19: Agitprop Service Page and Conversion Funnel
- [x] 19.1 Create `/agitprop` public product page with value proposition and CTA flow.
- [ ] 19.2 Add localized copy (`en`, `es`, `de`) for service page sections.
- [ ] 19.3 Add conversion telemetry plan (`service_view`, `register_click`, `login_click`).
- [ ] 19.4 Add smoke tests for `/agitprop` -> `/register` -> `/admin/login`.
- [ ] 19.5 Add SEO-focused service-page copy review before production indexation.


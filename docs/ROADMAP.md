# Project Roadmap: Akemi Tattoo Portfolio

Date: 2026-03-20
Current status: Phase 3 - Extended content and operations

## Executive Summary
Product: brutalist tattoo portfolio with gallery, bookings, contact, and payments.
Goal: evolve into an artist-managed platform with login, content CRUD, and scalable features.

## Fases

### Phase 0 - Discovery and scope (Done)
- Inventory of existing capabilities.
- Definition of main use cases.
- Initial functional specs for admin and scalability.

### Phase 1 - Formal specs (SDD) (Done)
- SDD Spec: requirements and scenarios (auth/roles, admin, gallery, posts, extensibility).
- SDD Design: architecture, flows, entities, RLS, storage, webhooks.
- SDD Tasks: implementation breakdown with dependencies.

### Phase 2 - Core admin implementation (Done)
- Admin auth (Supabase Auth).
- Admin base panel.
- Gallery CRUD (images + metadata).
- Validations and error messages.
- UX standardization for validations (admin + client).
- Admin route protection with session and role.
- Field-level error states (error + helper).

### Phase 3 - Extended content and operations (Active)
- Posts/news CRUD.
- Image storage (Supabase Storage) + CDN.
- Dark mode.
- Eye rest mode (warm tone on light theme).
- Public posts feed visible to clients.
- Multiple galleries with navigation.
- Gallery filter on public view.
- Advanced gallery editor (bulk upload, drag & drop, tags).
- Advanced post editor (draft, preview, scheduling).
- Admin profile (payments, addresses, email, nickname).
- Cloud connection for uploads (editor enabled only if connected).
- OAuth (Google, GitHub, Facebook or other artist providers).
- Admin console navigation (single active section + dropdown).
- English UI copy (admin + client).
- Separate admin design system from the public portal.
- Headless UI navigation for the admin workspace.
- Skeleton loading states on admin login and dashboard.
- Theme switcher available inside the admin experience.
- Neutral admin typography for console readability. Implemented.

### Phase 4 - Scalability and quality (Pending)
- Tags/collections/styles/locations.
- Basic analytics.
- Internationalization.
- User-selectable site languages: German, English, Spanish. Implemented for public UI preference and routing-level rendering.
- Admin-managed homepage section ordering. Implemented.
- Admin-managed homepage section naming. Implemented.
- Admin-managed homepage section visibility. Implemented.
- Security and performance hardening.
- Admin typography QA sweep after neutral font rollout.
- SDLC standard + PR manual security review.
- Upgrade dependency baseline during pre-prod hardening. In progress.
- Fix contrast of gallery filter option text across theme modes. Implemented.
- Add branded OAuth icons for Google and GitHub with theme-aware variants. Implemented.
- Add registration flow with email confirmation and OAuth sign-up. Implemented.
- Move focus and scroll to the active admin form when entering edit mode on mobile and desktop. Implemented.

### Payments (Last)
- Payments and webhooks are implemented last, after QA and stability.

## Deliverables by phase
- P0: Scope and roadmap document (this file).
- P1: Specs + Design + Tasks.
- P2: Admin implementation + baseline tests.
- P3: Advanced content + storage + admin profile + OAuth.
- P4: Scalability + QA + observability.

## Known blockers
- Requires keys and credentials (Supabase, Resend, Stripe/PayPal) for full flows.

## Update 2026-03-20
- Admin experience redesigned with a dedicated visual system separate from the public portal.
- Headless UI powers focused section navigation in the dashboard.
- Skeleton loading added to admin login and dashboard routes.
- Theme controls exposed inside admin login and admin dashboard.
- Configurable public section order, naming, and visibility implemented from the admin console.
- Public header navigation now follows configured visible homepage sections.
- Public locale selector implemented with persistent German, English, and Spanish preference.
- Homepage composition now fails open in admin with a guided fallback if production schema is behind.
- Gallery filter dropdown contrast was hardened for theme/native select mismatches.
- Admin OAuth buttons now use provider iconography aligned with the active theme.
- Registration route added with email confirmation and OAuth sign-up entry points.
- SEO baseline added with OpenGraph metadata, robots, sitemap, and structured data.
- Public gallery and editorial images now use `next/image` for the first performance pass.
- SEO/security audit review from `docs/reports/akemi-seo-security-audit-2026-03-24.pdf` is now part of the backlog and implementation order.
- Canonical metadata baseline implemented for current public routes.
- Locale preference cookie is now written server-side with production-aware attributes.
- Route-level SEO descriptions were strengthened for the homepage and gallery detail pages.
- Gallery detail pages now include stronger standalone descriptive content and summary chips.
- Public homepage tattoo payload was trimmed to the fields required for the public filter/grid.
- Abuse protection now includes a honeypot + rate-limit layer across public submission flows.
- Next.js powered-by fingerprinting is disabled in production responses.
- Public auth and admin auth utility routes are marked as non-indexable.
- Public empty states and fallback copy were upgraded to more editorial, client-facing language.

### Audit Follow-up Backlog
- Add canonical tags across public routes.
- Strengthen search-oriented metadata and page descriptions beyond brand-only copy.
- Replace placeholder/low-trust public copy before final indexation.
- Improve gallery detail pages with stronger standalone ranking content.
- Reduce public page payload where possible.
- Tighten CSP over time by reducing inline allowances and narrowing `connect-src`.
- Reduce stack fingerprinting where practical.
- Make abuse protection consistent across all public write endpoints.
- Evolve multilingual SEO beyond cookie-only switching when route-based locale architecture is introduced.
- Standardize locale cookie production attributes.

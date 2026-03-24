# NotebookLM Source Pack - Akemi Tattoo Portfolio

## Snapshot
- Date: 2026-03-24
- Environment target: Vercel + Supabase production
- Stack: Next.js App Router, React 19, Supabase (Postgres/Auth/Storage), Resend, Stripe/PayPal placeholders
- Current phase: MVP hardening and production verification

## What the Product Is
Akemi Tattoo Portfolio is a web application for a tattoo artist. It combines a public editorial portfolio with a dedicated admin console for content operations.

## MVP Scope
### Public
- Homepage with configurable sections.
- Theme switching (`light`, `eye`, `dark`).
- Locale switching (`en`, `es`, `de`).
- Public galleries and gallery detail pages.
- Public posts feed.
- Booking and contact forms.
- Registration with email confirmation and OAuth sign-up.

### Admin
- Email/password admin login.
- OAuth admin login.
- CRUD for galleries, pieces, and posts.
- Homepage composition manager.
- Admin profile and integrations screens.
- Dedicated admin design system.

## Architecture Summary
- Frontend: Next.js App Router, server-rendered public routes, interactive admin components.
- Backend: Supabase Postgres + Auth + Storage.
- Security: RLS, role-based admin gating, rate limiting, same-origin checks, honeypot fields, reduced fingerprinting.
- SEO: route metadata, canonicals, sitemap, robots, JSON-LD, social images.

## MVP Status
The MVP is near-complete locally. Remaining work is mainly production verification and credential-dependent smoke testing.

Reference documents:
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/PRE_PROD_CHECKLIST.md`

## Post-MVP Direction
After MVP signoff, the roadmap expands toward:
- sandbox payments
- appointment calendar management
- reminders and notifications
- WhatsApp and Google Calendar integrations
- chatbot guidance and developer ticket routing
- optional feature toggles and future SaaS direction

Reference: `docs/POST_MVP_BACKLOG.md`

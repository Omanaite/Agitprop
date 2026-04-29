# NotebookLM Source - Agitprop

## Snapshot
- Date: 2026-03-24
- Status: MVP hardening and production verification
- Stack: Next.js App Router + Supabase (Postgres, Auth, Storage)
- Branch target: `vercel`

## Roadmap Summary
- Phase 0: Discovery and scope (done)
- Phase 1: Formal SDD (done)
- Phase 2: Core admin (done)
- Phase 3: Extended content and operations (done / stabilized)
- Phase 4: MVP hardening and production verification (active)
- Phase 5: MVP signoff (pending)
- Post-MVP: SaaS direction and optional integrations (planned)

## Current Capabilities
- Public homepage with configurable section composition.
- Theme switching and locale preference.
- Galleries, gallery detail, and published content.
- Booking and contact flows.
- Registration with email confirmation and OAuth sign-up.
- Admin console with content CRUD, profile, and integrations screens.

## Current Risks / Dependencies
- Needs production smoke testing.
- Needs Supabase schema confirmation in the target project.
- Needs OAuth and email verification in production.
- Needs final SEO/copy approval before full indexation.

## Key Documents
- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/MVP_STATUS.md`
- `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
- `docs/POST_MVP_BACKLOG.md`
- `openspec/changes/admin-content-management/design.md`

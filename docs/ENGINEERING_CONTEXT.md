# Engineering Context Protocol

Date: 2026-04-01

## Purpose
Keep execution quality stable across long sessions, context compaction, and handoffs.

## Mandatory update points
- After each significant feature/fix:
  - update `docs/DEVLOG.md`
  - update `docs/STATE.md`
  - update `docs/ROADMAP.md` if stage/scope changed
  - update `openspec/changes/admin-content-management/tasks.md`
- Before release decisions:
  - sync `docs/MVP_STATUS.md`
  - sync `docs/PRE_PROD_CHECKLIST.md`
  - sync `docs/PENDING_EXTERNAL_INTERVENTIONS.md`

## Current architectural line (must preserve)
- Platform Admin Console (`/admin`) is SaaS governance only.
- Artist Workspace (`/studio`) is artist operations only.
- Artist modules must use `/api/studio/*`, not `/api/admin/*`.
- Tenant provisioning stays automatic for non-platform users.

## Skill baseline for this project
- `nextjs-app-router` and `next-best-practices` for routing/build stability.
- `nextjs-supabase-auth` + `supabase-developer` for auth and data access.
- `security-best-practices` for endpoint hardening.
- `ui-ux-pro-max` for private/public UX consistency.
- `sdd-*` skills for spec/design/tasks traceability.

## Release discipline
- Use prefixed commits (`feat:`, `fix:`, `docs:`, etc.).
- Keep PR notes aligned with roadmap phase and risk.
- Never ship schema-dependent features without fallback behavior and explicit SQL patch path.

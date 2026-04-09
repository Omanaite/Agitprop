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

## Skills convertidas a funciones backend (NO usar la skill — usar el código)

Las siguientes skills han sido eliminadas del sistema de prompts y reemplazadas por
funciones TypeScript deterministas. El modelo debe importar estas funciones en lugar
de "razonar" sobre el dominio.

| Skill eliminada | Reemplazada por | Qué resuelve |
|---|---|---|
| `design-akemi-specs` (`.agents/skills/desing-user-specs/`) | `lib/tenants/akemi-pilot.ts` → `AKEMI_PILOT` | Tokens de diseño, identidad del tenant piloto, principios del tema Brutalist. Importar `AKEMI_PILOT.designTokens` o `AKEMI_PILOT.artStyle`. |
| `terms-page-generator` (skill genérica) | `lib/legal/templates.ts` → `OPERATOR`, `getAGBSections()`, `getDatenschutzSections()` | Datos del operador, secciones AGB y Datenschutz tipadas. Las páginas en `app/legal/` consumen estos datos. |

### Regla para nuevas skills
Antes de cargar una skill como contexto, evaluar si su output es determinista.
Si lo es → convertir a función en `lib/` y documentar aquí.
Si requiere razonamiento contextual → usar skill normalmente.

### Pendientes de conversión (Prioridad 2)
- `agent-teams-lite` → `lib/agents/orchestrator.ts` (state machine de fases SDD)
- `spec-kit-command-cursor` → `lib/agents/spec-runner.ts` (fases serializadas JSON)

### Pendientes de conversión (Prioridad 3)
- `next-best-practices` → ESLint custom rules (`.eslintrc.json`)
- `web-design-guidelines` → script `tools/audit-a11y.ts` con axe-core

## Release discipline
- Use prefixed commits (`feat:`, `fix:`, `docs:`, etc.).
- Keep PR notes aligned with roadmap phase and risk.
- Never ship schema-dependent features without fallback behavior and explicit SQL patch path.

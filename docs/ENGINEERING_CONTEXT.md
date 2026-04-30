# Engineering Context Protocol

Document role: Canonical
Owner: Engineering workflow
Scope: Project-wide execution rules, architectural invariants, and update protocol
Last updated: 2026-04-29

Date: 2026-04-01

## Purpose
Keep execution quality stable across long sessions, context compaction, and handoffs.

## Non-negotiable execution principles
- Do not invent facts about the codebase, architecture, file state, or runtime behavior.
- Before changing code, verify the relevant local source of truth in the repository.
- Prefer the smallest correct change that solves the specific problem.
- Keep changes atomic and tightly scoped to the requested feature or fix.
- Do not modify unrelated files while solving a specific issue unless the dependency is real, necessary, and explicitly documented in the work log.
- If a broader refactor seems useful but is not required for the requested fix, defer it and propose it separately.

## ⚠️ Multi-agent coordination
Antes de tocar cualquier archivo: leer sección **COORDINACIÓN** en `docs/STATE.md`.
Registrar ahí los archivos que vas a editar. **Es obligatorio usar esta tabla incluso trabajando solo.**
En caso de solapamiento de archivos, utiliza la tabla para conversar con el otro agente y llegar a un acuerdo antes de proceder.

## Mandatory update points
- After each significant feature/fix:
  - update `docs/DEVLOG.md`
  - update `docs/STATE.md`
  - update `docs/ROADMAP.md` if stage/scope changed
  - update `openspec/changes/admin-content-management/tasks.md`
  - record execution trace in `docs/DEVLOG.md`:
    - agent used
    - model used
    - if the exact model variant is unavailable in-session, record the best available identifier honestly
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

## UI/UX skill baseline (mandatory for design-facing work)
For frontend design, UI audits, redesigns, and creation of new public or private UI surfaces, use this baseline together:
- `impeccable`
- `emil-design-eng`
- `design-taste-frontend`

Apply it to:
- new marketing pages
- new product, admin, or studio UI
- visual refactors
- UI/UX audits
- typography, spacing, interaction, and motion passes

If one of these skills cannot be applied cleanly in a session, state the limitation explicitly in the work log and continue with the strongest available fallback.

## Skills convertidas a funciones backend (NO usar la skill — usar el código)

Las siguientes skills han sido eliminadas del sistema de prompts y reemplazadas por
funciones TypeScript deterministas. El modelo debe importar estas funciones en lugar
de "razonar" sobre el dominio.

| Skill eliminada | Reemplazada por | Qué resuelve |
|---|---|---|
| `design-akemi-specs` (`.agents/skills/desing-user-specs/`) | `lib/tenants/akemi-pilot.ts` → `AKEMI_PILOT` | Tokens de diseño, identidad del tenant piloto, principios del tema Brutalist. Importar `AKEMI_PILOT.designTokens` o `AKEMI_PILOT.artStyle`. |
| `terms-page-generator` (skill genérica) | `lib/legal/templates.ts` → `OPERATOR`, `getAGBSections()`, `getDatenschutzSections()` | Datos del operador, secciones AGB y Datenschutz tipadas. Las páginas en `app/legal/` consumen estos datos. |
| `agent-teams-lite` (`.agents/skills/agent-teams-lite-main/`) | `lib/agents/orchestrator.ts` + `lib/agents/spec-runner.ts` | State machine SDD: fases (init→propose→design→tasks→apply→verify→archive), transiciones validadas, generador de prompts para sub-agentes, persistencia en `openspec/changes/`. API: `run()`, `resume()`, `done()`, `status()`, `listAll()`. |
| `spec-kit-command-cursor` (`.agents/skills/spec-kit-command-cursor-main/`) | `lib/agents/spec-runner.ts` → `plan()`, `resume()`, `run()` | Flujo plan-approve-execute serializado. Sin ambigüedad: el runner define qué fase viene después y genera el prompt exacto. |

### Regla para nuevas skills
Antes de cargar una skill como contexto, evaluar si su output es determinista.
Si lo es → convertir a función en `lib/` y documentar aquí.
Si requiere razonamiento contextual → usar skill normalmente.

### Pendientes de conversión (Prioridad 3)
<!-- Prioridad 2 completada: orchestrator.ts + spec-runner.ts ✅ -->

### Pendientes de conversión (Prioridad 3)
- `next-best-practices` → ESLint custom rules (`.eslintrc.json`)
- `web-design-guidelines` → script `tools/audit-a11y.ts` con axe-core

## Release discipline
- Use prefixed commits (`feat:`, `fix:`, `docs:`, etc.).
- Keep PR notes aligned with roadmap phase and risk.
- Never ship schema-dependent features without fallback behavior and explicit SQL patch path.

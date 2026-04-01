# Agitprop — Claude Code Project Rules

## Workflow SDD
- Antes de implementar: revisar `docs/ENGINEERING_CONTEXT.md` y `.atl/skill-registry.md`
- Post-feature: sync `docs/DEVLOG.md`, `docs/STATE.md`, `docs/ROADMAP.md`
- Commits prefijados: `feat:`, `fix:`, `docs:`, `chore:`
- Branch activa: `vercel` → auto-deploy a Vercel en cada push

## Reglas de Respuesta (CONFIG_OPTIMIZACIÓN_TOKENS)
- Respuestas ultra-concisas. Sin preámbulos, cortesías ni cierres.
- Código: entregar solo el fragmento modificado, nunca reescribir archivos completos.
- Documentar avances con Notación Técnica Comprimida:
  `Módulo: [X] -> Acción: [Y] -> Salida: [Z]`
- Usar XML tags para delimitar bloques de código e instrucciones.
- Antes de responder: verificar si la salida puede simplificarse sin perder precisión.
- Objetivo: completar el proyecto SaaS con mínimo consumo de tokens.

## Arquitectura Clave
- `/admin` → gobernanza SaaS (platform admin únicamente)
- `/studio` → workspace del artista (operaciones, contenido)
- APIs artista: `/api/studio/*` — nunca `/api/admin/*`
- Auth guard: `proxy.ts` (no middleware.ts — Next 16 usa proxy)
- Plan enforcement: `lib/tenants/plan.ts`
- Theme policy: `lib/tenants/theme.ts`

## Seguridad
- Todo POST/PATCH/PUT: `enforceSameOrigin()` + `rateLimit()` + `requireArtistOperator()` o `requireAdmin()`
- No PR sin security review manual
- Features de providers degradan safe si env vars ausentes

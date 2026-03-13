# SDLC Quality Standard

## Objetivo
Definir un estándar de calidad para todo el ciclo de vida del software.

## Fases y Gate de Calidad

### 1) Planificación (SDD)
- Requiere `proposal`, `specs`, `design`, `tasks` en `openspec/`.
- Actualizar `docs/ROADMAP.md` y `docs/DOCUMENTATION_TRACKER.md`.

### 2) Implementación
- Commits con prefijos: `feat:`, `fix:`, `docs:`, `refactor:`.
- Validaciones UX consistentes en admin y cliente.

### 3) Testing
- Ejecutar tests disponibles (unit/integration/e2e si existen).
- Verificar flujos críticos manualmente cuando no existan tests.

### 4) Seguridad
- Ejecutar revisión de seguridad con **Claude Code Security Review**.
- Registrar hallazgos en `docs/SECURITY_REVIEW.md`.

### 5) Pull Request
- Cada push relevante debe abrir PR.
- Condición: aprobar directrices del security review.
- El merge se realiza manualmente tras aprobación.

## Checklist de Release
- [ ] Tests ejecutados
- [ ] Security review aprobado
- [ ] Docs actualizadas
- [ ] Roadmap actualizado

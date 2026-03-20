# SDLC Quality Standard

## Objetivo
Definir un estandar de calidad para todo el ciclo de vida del software.

## Fases y Gates de Calidad

### 1) Planificacion (SDD)
- Requiere `proposal`, `specs`, `design`, `tasks` en `openspec/`.
- Actualizar `docs/ROADMAP.md` y `docs/DOCUMENTATION_TRACKER.md`.
- Antes de ejecutar cambios, revisar `C:\GitHub\akemi\.atl\skill-registry.md` y cargar las skills aplicables.
- Cuando Engram este disponible, registrar el contexto operativo y las skills activadas como parte del preflight.

### 2) Implementacion
- Commits con prefijos: `feat:`, `fix:`, `docs:`, `refactor:`.
- Validaciones UX consistentes en admin y cliente.
- Si cambia el dominio del trabajo (UI, auth, seguridad, SQL, SDD), repetir revision de skills antes de seguir.

### 3) Testing
- Ejecutar tests disponibles (unit, integration, e2e) si existen.
- Verificar flujos criticos manualmente cuando no existan tests automatizados.
- Ningun cambio esta listo para release sin una verificacion proporcional a su riesgo.

### 4) Seguridad
- Ejecutar revision de seguridad manual usando `docs/SECURITY_REVIEW.md`.
- Registrar hallazgos en `docs/SECURITY_REVIEW.md`.
- Ningun cambio es elegible para merge si no satisface las directrices internas de seguridad del proyecto.

### 5) Pull Request
- Cada push relevante debe abrir un Pull Request.
- Todo PR debe pasar revision de seguridad manual.
- La aprobacion de las directrices internas de seguridad es un gate obligatorio de merge.
- El merge se realiza manualmente solo despues de aprobar seguridad, validar calidad y revisar documentacion.

## Checklist de Release
- [ ] Tests ejecutados
- [ ] Security review aprobado
- [ ] Directrices internas de seguridad aprobadas
- [ ] Docs actualizadas
- [ ] Roadmap actualizado
- [ ] Skills revisadas en preflight
- [ ] Contexto relevante guardado en Engram
- [ ] PR abierto y listo para revision manual

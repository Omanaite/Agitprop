# State Snapshot - Akemi Tattoo Portfolio

Fecha: 2026-03-13
Branch objetivo: vercel

## Objetivo
Mantener un resumen unico y persistente del estado del proyecto, decisiones, pendientes y pasos de produccion para evitar depender del contexto del chat.

## Estado Actual
- Admin CMS: login + CRUD de galerias, piezas (tattoos) y posts implementado.
- Public site: galeria, listado de galerias con detalle, posts publicados, contacto, bookings, pagos.
- Seguridad: RLS, rate limiting, validaciones en API, verificacion de origen, CSP en prod.
- Temas: light, dark, eye (descanso de ojos).
- Documentacion: roadmap, manual admin, validaciones UX, seguridad, SDLC, PR process.
- Engram: activo en Codex (config en AppData\Roaming\codex\config.toml).

## Cambios Clave Recientes
- proxy.ts activo (migracion de middleware) para Next 16.
- Fix de build TypeScript: tipado en lib/supabase/ssr.ts.
- Admin UX: flujo guiado en galerias/piezas, validacion rapida de campos requeridos.
- Posts: preview + programacion publica y validaciones UI.
- Gitignore: engram/ ignorado para evitar fallos en build.

## Bloqueo Actual (Vercel)
Vercel sigue compilando un commit antiguo (ej: 15419e2) en lugar del ultimo. Esto mantiene errores de build.

### Solucion
1. Confirmar que el branch `vercel` en GitHub tenga el ultimo commit (ej: cccb696 o mas nuevo).
2. En Vercel, seleccionar ese commit y hacer Redeploy.
3. Verificar en el log: "Cloning ... (Branch: vercel, Commit: <ultimo>)".

## Tareas Pendientes (Alta prioridad)
- Confirmar deploy limpio en Vercel con el ultimo commit.
- Barrido final UX/UI (admin + cliente) segun guia de validaciones.
- Checklist pre-prod + pruebas manuales.

## Tareas Pendientes (Media)
- Refinar copy y microcopy admin/cliente (coherencia total).
- Ajustes finales de accesibilidad (focus, aria-live, tamaños tactiles).

## Runbook Produccion (Resumen)
1. Verificar env vars en Vercel: SUPABASE, RESEND, STRIPE, PAYPAL.
2. Deploy branch `vercel` con commit actual.
3. Pruebas manuales:
   - Login admin
   - CRUD galerias
   - CRUD piezas + orden
   - CRUD posts + preview
   - Public site: galerias, detalle, posts, contacto, booking, pagos
4. Validar logs de errores (Vercel + Supabase).

## Archivos Clave
- Admin UI: components/admin/GalleryManager.tsx, GalleriesManager.tsx, PostManager.tsx
- API: app/api/admin/*, app/api/bookings, app/api/contact
- Data: lib/data/*
- Seguridad: lib/security.ts, lib/rate-limit.ts, docs/SECURITY_REVIEW.md
- Specs: openspec/changes/admin-content-management/*

## Decisiones Clave
- Auth admin con Supabase Auth + app_metadata.role=admin.
- RLS aplicado en todas las tablas.
- Storage bucket: gallery (public read, admin write).
- Commit estándar con prefijos (feat, fix, docs, chore).

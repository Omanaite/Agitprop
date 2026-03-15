# NotebookLM Source - Akemi Tattoo Portfolio

## Snapshot
- Fecha: 2026-03-15
- Entorno: Produccion (Vercel)
- Stack: Next.js App Router + Supabase (Postgres, Auth, Storage)
- Estado: Admin CMS funcional, roadmap actualizado, pagos al final.

## Roadmap (resumen)
- Fase 0: Descubrimiento (Completa)
- Fase 1: SDD Specs/Design/Tasks (Completa)
- Fase 2: Nucleo Admin (Completa)
- Fase 3: Contenido avanzado (Actual)
  - Editor avanzado (bulk upload, reorder, preview, scheduling)
  - Galerias multiples y detalle publico
  - Perfil admin (datos, direcciones, pagos)
  - Conexion a nube
  - OAuth (Google/GitHub/Facebook)
- Fase 4: Escalabilidad y calidad (Pendiente)
  - Tags/colecciones/estilos
  - Analitica basica
  - i18n
  - Hardening + performance
- Pagos: ultimo paso (post QA)

## Arquitectura (resumen)
- Frontend: Next.js App Router, SSR/ISR, UI brutalista, temas light/dark/eye.
- Backend: Supabase Auth + RLS + Storage, CRUD via API routes.
- Seguridad: CSP, headers, rate limiting, RLS en tablas.
- Extensibilidad: nuevos tipos, OAuth, integraciones cloud, admin profile.

## Funcionalidades actuales
- Publico: galeria, detalle de galerias, posts publicados, booking, contacto.
- Admin: login, CRUD galerias/piezas/posts, validaciones UX.

## Pendientes priorizados
- QA completo con seed
- Perfil admin
- OAuth providers
- Conexiones cloud
- SEO avanzado (OG, sitemap, schema.org)
- Pagos al final

## Datos de prueba
- Archivo: supabase/seed.sql
- Incluye: galleries, tattoos, posts, bookings, audit_logs
- Pendientes: oauth identities, admin profile, cloud connections, payments

## Documentos clave
- docs/MASTER_DOCUMENT.md
- docs/ROADMAP.md
- docs/PROJECT_OVERVIEW.md
- docs/STATE.md
- openspec/changes/admin-content-management/design.md

## Notas operativas
- Deploy en Vercel con branch vercel.
- Supabase auth con app_metadata.role=admin.
- Temas UI habilitados.
- CSP ajustado para compatibilidad con Next.

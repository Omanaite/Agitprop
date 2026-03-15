# Documento Maestro - Akemi Tattoo Portfolio

Fecha: 2026-03-14
Version: 1.0

## 1. Roadmap

### Fase 0 – Descubrimiento (Completa)
- Inventario de funcionalidades
- Casos de uso
- Alcance inicial

### Fase 1 – SDD (Completa)
- Specs, Design, Tasks
- Reglas de calidad y PR

### Fase 2 – Nucleo Admin (Completa)
- Login admin
- CRUD galerias, piezas y posts
- Validaciones UX
- RLS + Storage

### Fase 3 – Contenido Avanzado (Actual)
- Editor avanzado (bulk upload, reorder, preview, scheduling)
- Galerias multiples y detalle publico
- Perfil admin (datos personales + pagos + direcciones)
- Conexion a nube
- OAuth (Google/GitHub/Facebook)

### Fase 4 – Escalabilidad y Calidad (Pendiente)
- Tags / colecciones / estilos
- Analitica basica
- i18n
- Hardening + performance

### Pagos (Final)
- Stripe/PayPal al final, despues de QA y estabilidad

---

## 2. Arquitectura del Proyecto

### Frontend
- Next.js App Router
- Rutas publicas + panel admin
- UI brutalista + temas (light/dark/eye)

### Backend
- Supabase (Postgres + RLS + Storage)
- Auth con roles (app_metadata.role=admin)
- API routes en Next.js

### Seguridad
- CSP + headers
- RLS en tablas
- Rate limit en endpoints

### Extensibilidad
- Nuevos tipos de contenido sin romper vistas
- OAuth + integraciones cloud planeadas
- Admin Profile planeado

---

## 3. Alcance del Proyecto

### Alcance Actual
- Portfolio publico
- Booking + contacto
- Admin CMS (galerias + posts)
- Temas UI
- Seguridad base

### Alcance Proximo
- Perfil admin
- OAuth
- Conexion cloud
- Analitica
- i18n

---

## 4. Escalabilidad

El sistema esta preparado para:
- Agregar nuevas entidades (colecciones, estilos, servicios)
- Multi-admin
- Integraciones externas
- Escalar contenido sin romper UX

---

## 5. SEO

### Implementado
- Metadata base
- URLs limpias
- Contenido SSR

### Pendiente
- OpenGraph completo
- Sitemap dinamico
- Schema.org
- Optimizacion de imagenes

---

## 6. Estado Actual (Snapshot)

- Admin CMS funcional
- Deploy en Vercel
- Auth con Supabase
- Roadmap y specs actualizados

---

## 7. Archivos clave

- `docs/ROADMAP.md`
- `docs/STATE.md`
- `docs/PROJECT_OVERVIEW.md`
- `openspec/changes/admin-content-management/design.md`
- `supabase/schema.sql`
- `supabase/seed.sql`

---

## 8. Notas finales

- Pagos se implementan al final del ciclo
- QA antes de producción
- Mantener SDLC y PR process activos


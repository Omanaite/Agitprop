# Roadmap del Proyecto: Akemi Tattoo Portfolio

Fecha: 2026-03-12
Estado actual: Fase 0 - Descubrimiento y especificaciones preliminares

## Resumen Ejecutivo
Producto: portfolio brutalista para tatuadora con galería, bookings, contacto y pagos.
Objetivo: evolucionar a una plataforma administrable por el artista con login, CRUD de contenido, y escalabilidad para nuevas funcionalidades.

## Fases

### Fase 0 - Descubrimiento y alcance (Actual)
- Inventario de funcionalidades existentes.
- Definición de casos de uso principales.
- Especificaciones funcionales preliminares para admin y escalabilidad.

### Fase 1 - Especificaciones formales (SDD)
- SDD Spec: requisitos y escenarios (auth/roles, admin, gallery, posts, extensibilidad).
- SDD Design: arquitectura, flujos, entidades, RLS, storage y webhooks.
- SDD Tasks: desglose en tareas implementables con dependencias.

### Fase 2 - Implementación núcleo admin
- Auth admin (Supabase Auth).
- Panel admin base.
- CRUD de galería (imagenes + metadatos).
- Validaciones y mensajes de error.
- Estandarización UX de validaciones (admin + cliente).
- Protección de rutas admin con sesión y rol.
- Estados visuales por campo (error + helper).

### Fase 3 - Contenido ampliado y operaciones
- CRUD de posts/noticias/flash drops.
- Storage para imágenes (Supabase Storage) + CDN.
- Webhooks de pagos (Stripe/PayPal) si aplica.
- Modo oscuro (dark mode).
- Modo descanso de ojos (tono amarillo en modo claro).
- Publicación visible para cliente (feed público de posts).
- Galerías múltiples con navegación.
- Filtro de galería en vista pública.
- Editor avanzado de galería (bulk upload, drag & drop, tags).
- Editor avanzado de publicaciones (draft, preview, scheduling).

### Fase 4 - Escalabilidad y calidad
- Tags/colecciones/estilos/ubicaciones.
- Analíticas básicas.
- Internacionalización.
 - Endurecimiento de seguridad y performance.
 - Estándar SDLC + PR con revisión de seguridad manual.

## Entregables por fase
- F0: Documento de alcance y roadmap (este archivo).
- F1: Specs + Design + Tasks.
- F2: Implementación admin + pruebas base.
- F3: Contenido avanzado + storage + pagos robustos.
- F4: Escalabilidad + QA + observabilidad.

## Bloqueos conocidos
- Requiere configuración de llaves y credenciales (Supabase, Resend, Stripe/PayPal) para flujos completos.

## Actualizacion 2026-03-13
- Galerias publicas con pagina de detalle.
- Enlaces desde listado de galerias a detalle.
- Fix de login admin para flujo de errores sin romper build.

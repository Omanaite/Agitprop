# Roadmap del Proyecto: Akemi Tattoo Portfolio

Fecha: 2026-03-13
Estado actual: Fase 3 - Contenido ampliado y operaciones

## Resumen Ejecutivo
Producto: portfolio brutalista para tatuadora con galeria, bookings, contacto y pagos.
Objetivo: evolucionar a una plataforma administrable por el artista con login, CRUD de contenido, y escalabilidad para nuevas funcionalidades.

## Fases

### Fase 0 - Descubrimiento y alcance (Completo)
- Inventario de funcionalidades existentes.
- Definicion de casos de uso principales.
- Especificaciones funcionales preliminares para admin y escalabilidad.

### Fase 1 - Especificaciones formales (SDD) (Completo)
- SDD Spec: requisitos y escenarios (auth/roles, admin, gallery, posts, extensibilidad).
- SDD Design: arquitectura, flujos, entidades, RLS, storage y webhooks.
- SDD Tasks: desglose en tareas implementables con dependencias.

### Fase 2 - Implementacion nucleo admin (Completo)
- Auth admin (Supabase Auth).
- Panel admin base.
- CRUD de galeria (imagenes + metadatos).
- Validaciones y mensajes de error.
- Estandarizacion UX de validaciones (admin + cliente).
- Proteccion de rutas admin con sesion y rol.
- Estados visuales por campo (error + helper).

### Fase 3 - Contenido ampliado y operaciones (Actual)
- CRUD de posts/noticias/flash drops.
- Storage para imagenes (Supabase Storage) + CDN.
- Modo oscuro (dark mode).
- Modo descanso de ojos (tono amarillo en modo claro).
- Publicacion visible para cliente (feed publico de posts).
- Galerias multiples con navegacion.
- Filtro de galeria en vista publica.
- Editor avanzado de galeria (bulk upload, drag & drop, tags).
- Editor avanzado de publicaciones (draft, preview, scheduling).
- Perfil de administrador (datos de pago, direcciones, email, apodo).
- Conexion a nube para subida de imagenes (habilita editor si esta conectado).
- OAuth (Google, GitHub, Facebook u otros usados por artistas).

### Fase 4 - Escalabilidad y calidad (Pendiente)
- Tags/colecciones/estilos/ubicaciones.
- Analiticas basicas.
- Internacionalizacion.
- Endurecimiento de seguridad y performance.
- Estandar SDLC + PR con revision de seguridad manual.

### Pagos (Final)
- Pagos y webhooks se implementan al final, luego de QA y estabilidad total.

## Entregables por fase
- F0: Documento de alcance y roadmap (este archivo).
- F1: Specs + Design + Tasks.
- F2: Implementacion admin + pruebas base.
- F3: Contenido avanzado + storage + admin profile + OAuth.
- F4: Escalabilidad + QA + observabilidad.

## Bloqueos conocidos
- Requiere configuracion de llaves y credenciales (Supabase, Resend, Stripe/PayPal) para flujos completos.

## Actualizacion 2026-03-13
- Galerias publicas con pagina de detalle.
- Enlaces desde listado de galerias a detalle.
- Fix de login admin para flujo de errores sin romper build.
- Admin UX refinado con validaciones y flujo guiado.

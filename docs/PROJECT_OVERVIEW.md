# Project Overview: Akemi Tattoo Portfolio

## Producto
Webapp de portfolio para artista tatuador con estetica brutalista. Incluye galeria, formulario de booking, contacto y pagos opcionales (pagos al final del roadmap).

## Alcance Actual
- Galeria: lectura publica desde Supabase con fallback local.
- Booking: creacion de solicitudes en DB.
- Contacto: envio de email (si Resend esta configurado).
- Pagos: Stripe/PayPal disponibles pero planificados al final.

## Alcance Propuesto
- Login para artista/administrador.
- Panel admin con CRUD de galeria y publicaciones.
- Sistema visual del admin separado del portal publico.
- Configuracion del orden de secciones de la home por parte del admin.
- Configuracion del nombre visible de secciones publicas por parte del admin.
- Configuracion de visibilidad de secciones publicas por parte del admin.
- Escalabilidad para nuevas entidades (tags, colecciones, estilos, ubicaciones).
- Temas de interfaz: dark mode y eye-rest mode.
- Selector de idioma para el sitio publico: aleman, ingles y espanol.
- Editor avanzado de galeria y publicaciones (bulk upload, reordenamiento, drafts).
- Perfil administrador (datos de pago, direcciones, email, apodo).
- Conexion a nube para cargar imagenes (habilita editor si esta conectado).
- OAuth con GitHub/Google/Facebook u otros usados por artistas.
- Botones OAuth con iconografia visible y coherente por tema visual.
- Registro con confirmacion por email y opcion de registro mediante OAuth.

## Estado de Implementacion
- Admin login y panel: Implementado.
- CRUD de galeria y posts: Implementado (API + UI).
- Admin UI/UX dedicado: Implementado con navegacion propia y loading skeletons.
- RLS y storage bucket: Definidos en `supabase/schema.sql`.
- Galerias multiples: Implementacion base (DB + API + UI select).
- Posts publicos: Vista publica basica implementada.
- Proxy middleware: Migrado a `proxy.ts`.
- Composicion de home publica: implementada desde admin (orden, nombre, eyebrow, visibilidad).
- Idioma publico: implementado con selector persistente para ingles, espanol y aleman.

## Casos de Uso
- Visitantes exploran la galeria y contenido publico.
- Clientes solicitan sesiones mediante booking.
- Artista publica y mantiene su trabajo desde el panel.
- Perfil admin para gestionar datos y conexiones.
- Admin trabaja en una consola separada visualmente del sitio publico.
- Admin decide que seccion aparece primero, segunda, tercera, etc. en la home.
- Admin renombra secciones publicas segun necesidad editorial.
- Admin oculta o publica secciones de la home sin redeploy.
- Visitante cambia idioma del sitio de forma similar al cambio de tema.

## Stack
- Next.js App Router
- Supabase (Postgres + RLS)
- Resend (email)
- Stripe y PayPal (pagos, al final del roadmap)

## Gestion de Conocimiento
- Mantener `openspec/` actualizado con specs, design y tasks.
- Actualizar el skill registry cuando se agreguen/remuevan skills.
- Mantener `docs/STATE.md` como snapshot del estado.

# Project Overview: Akemi Tattoo Portfolio

## Producto
Webapp de portfolio para artista tatuador con estética brutalista. Incluye galería, formulario de booking, contacto, y pagos opcionales.

## Alcance Actual
- Galería: lectura pública desde Supabase con fallback local.
- Booking: creación de solicitudes en DB.
- Contacto: envío de email (si Resend está configurado).
- Pagos: Stripe/PayPal para depósitos y diseño (checkout/orden).

## Alcance Propuesto
- Login para artista/administrador.
- Panel admin con CRUD de galería y publicaciones.
- Escalabilidad para nuevas entidades (tags, colecciones, estilos, ubicaciones).
- Temas de interfaz: dark mode y eye-rest mode.

## Estado de Implementación
- Admin login y panel: Implementado.
- CRUD de galería y posts: Implementado (API + UI).
- RLS y storage bucket: Definidos en `supabase/schema.sql`.

## Casos de Uso
- Visitantes exploran la galería y contenido público.
- Clientes solicitan sesiones mediante booking.
- Artista publica y mantiene su trabajo desde el panel.
- Pagos gestionados por pasarela externa.

## Stack
- Next.js App Router
- Supabase (Postgres + RLS)
- Resend (email)
- Stripe y PayPal (pagos)

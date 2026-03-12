# Documento para NotebookLM / Exportable a PDF

## Resumen del Proyecto
Akemi Tattoo Portfolio es una webapp brutalista para exhibir trabajos de un artista tatuador. El sistema incluye galería pública, booking, contacto y pagos, y se expandirá con panel administrativo para gestionar contenido.

## Alcance Actual
- Galería de trabajos (lectura pública).
- Booking de sesiones (creación de solicitudes).
- Contacto (envío de email).
- Pagos (Stripe/PayPal).

## Alcance Propuesto
- Login para administrador.
- CRUD de galería y publicaciones.
- Escalabilidad: tags, colecciones, estilos, ubicaciones.
- Temas UI: dark mode y eye-rest mode.

## Funcionalidades Clave
- Gestión de contenido por el artista.
- Vistas públicas optimizadas.
- Pagos externos configurables.

## Manual de Administrador (Resumen)
- Iniciar sesión en panel admin.
- Crear/editar/eliminar piezas de galería.
- Crear/editar/eliminar publicaciones.
Nota: el usuario debe tener rol `admin` en Supabase Auth.

## Roadmap (Resumen)
- F0: Descubrimiento y alcance.
- F1: Specs y diseño (SDD).
- F2: Implementación núcleo admin.
- F3: Contenido ampliado y storage.
- F4: Escalabilidad y calidad.

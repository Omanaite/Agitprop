# Manual de Administrador

## Objetivo
Guiar al artista/administrador en el uso del panel para gestionar la galería y publicaciones.

## Acceso
- Iniciar sesión con credenciales de administrador.
- Acceder al panel desde la ruta privada del admin.
Nota: el usuario debe tener el rol `admin` en `app_metadata` de Supabase Auth.

## Gestión de Galería
- Crear nueva pieza: subir imagen, título, descripción y estilo.
- Editar pieza: actualizar metadatos.
- Eliminar pieza: confirmar antes de borrar.
Opcional: subir imagen desde el panel para obtener URL pública.
Opcional: asignar la pieza a una galería específica.

## Gestión de Galerías
- Crear galería con título y slug.
- Editar descripción y slug.
- Eliminar galería si ya no se usa.

## Gestión de Publicaciones
- Crear post: título y contenido.
- Editar post: actualizar contenido.
- Eliminar post: confirmar antes de borrar.
Nota: solo los posts `published` se muestran en el sitio público.

## Buenas prácticas
- Usar imágenes optimizadas y con buena resolución.
- Mantener descripciones claras y consistentes.
- Revisar el contenido antes de publicar.
- Usar modo oscuro o descanso de ojos para sesiones largas.

## Resolución de problemas
- Si no puedes iniciar sesión: verificar credenciales.
- Si no aparece una pieza: revisar el estado del registro y conexión.
- Si no tienes permisos: validar rol `admin` en Supabase Auth.

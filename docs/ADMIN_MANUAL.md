# Manual de Administrador

## Objetivo
Guiar al artista/administrador en el uso del panel para gestionar perfil, integraciones, galeria y publicaciones.

## Acceso
- Iniciar sesion con credenciales de administrador.
- Acceder al panel desde la ruta privada del admin.
Nota: el usuario debe tener el rol `admin` en `app_metadata` de Supabase Auth.

## Orden recomendado del panel
1. Perfil Admin
2. Integraciones (OAuth / nube)
3. Galerias
4. Piezas (Galeria)
5. Posts

## Perfil Admin
- Editar email, apodo, direccion de envio y facturacion.
- Guardar notas de pago (referencias internas).

## Integraciones
- Conectar OAuth o nube (si aplica).
- Si no hay conexion activa, el upload remoto se bloquea.

## Gestion de Galeria (Piezas)
- Crear nueva pieza: subir imagen, titulo, descripcion y estilo.
- Editar pieza: actualizar metadatos.
- Eliminar pieza: confirmar antes de borrar.
Opcional: asignar la pieza a una galeria especifica.

## Gestion de Galerias
- Crear galeria con titulo y slug.
- Editar descripcion y slug.
- Eliminar galeria si ya no se usa.

## Gestion de Publicaciones
- Crear post: titulo y contenido.
- Editar post: actualizar contenido.
- Eliminar post: confirmar antes de borrar.
Nota: solo los posts `published` se muestran en el sitio publico.

## Buenas practicas
- Usar imagenes optimizadas y con buena resolucion.
- Mantener descripciones claras y consistentes.
- Revisar el contenido antes de publicar.
- Usar modo oscuro o descanso de ojos para sesiones largas.

## Resolucion de problemas
- Si no puedes iniciar sesion: verificar credenciales.
- Si no aparece una pieza: revisar el estado del registro y conexion.
- Si no tienes permisos: validar rol `admin` en Supabase Auth.

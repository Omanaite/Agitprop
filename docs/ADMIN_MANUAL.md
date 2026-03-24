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
3. Home Composition
4. Galerias
5. Piezas (Galeria)
6. Posts

## UI del Admin
- El panel usa una identidad visual separada del portal publico.
- El panel usa una tipografia neutral separada de la tipografia brutalista publica.
- Solo se muestra una seccion principal a la vez.
- En desktop la navegacion vive en la columna lateral.
- En mobile la navegacion se resuelve mediante menu desplegable.
- El login y el dashboard muestran skeleton loading mientras cargan.
- El admin mantiene selector de tema: normal, eye-rest y dark.

## Perfil Admin
- Editar email, apodo, direccion de envio y facturacion.
- Guardar notas de pago (referencias internas).

## Integraciones
- Conectar OAuth o nube (si aplica).
- Si no hay conexion activa, el upload remoto se bloquea.

## Home Composition
- Reordenar las secciones publicas del home.
- Renombrar el titulo visible de cada seccion.
- Ajustar eyebrow/subtitulo editorial de cada bloque.
- Ocultar o mostrar secciones sin redeploy.
- La navegacion publica del header sigue las secciones visibles y su orden.

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
- Si `Homepage sections` carga en modo fallback: aplicar el ultimo `schema.sql`
  en Supabase para habilitar persistencia real de composicion.

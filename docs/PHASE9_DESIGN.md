# Phase 9 - Technical Design (Admin Profile + OAuth + Cloud)

Fecha: 2026-03-15

## Objetivo
Agregar gestion de perfil del admin, conexiones OAuth y vinculacion de nubes para subir imagenes. El editor de galeria y posts solo habilita carga remota cuando exista conexion valida.

## Alcance
- Perfil admin: email, apodo, direccion envio, direccion facturacion, metadata de pagos (solo referencia, no datos sensibles).
- OAuth: Google / GitHub / Facebook (configurable por entorno).
- Cloud: conexion a proveedor (Google Drive, Dropbox, S3 u otro), con estado y tokens rotativos.
- UI gating: si no hay conexion cloud, el editor de galeria y posts muestra estado "no conectado" y bloquea upload remoto.

## Decisiones clave
- Perfil admin se almacena en tabla propia `admin_profiles` y se vincula por `user_id`.
- Conexiones externas se modelan en `admin_integrations` con tipo y estado.
- Tokens sensibles se guardan en `admin_integrations.secret_ref` y se manejan via vault / edge function (no en cliente).
- OAuth se maneja via Supabase Auth (providers) y se refleja en `admin_integrations`.

## Flujos

### Perfil admin
1. Admin abre /admin/profile
2. API lee `admin_profiles` por `user_id`
3. Admin edita y guarda
4. Validacion server-side y update

### OAuth providers
1. Admin elige provider
2. Supabase Auth OAuth flow
3. Callback -> guarda estado en `admin_integrations`
4. UI muestra conectado

### Cloud storage
1. Admin conecta proveedor
2. Token guardado (server-side)
3. Editor habilita upload remoto
4. Si token expira, se marca `status=expired`

## APIs
- GET /api/admin/profile
- PUT /api/admin/profile
- GET /api/admin/integrations
- POST /api/admin/integrations/:provider/connect
- POST /api/admin/integrations/:provider/disconnect

## UI
- Nueva vista `app/admin/profile`
- Seccion Integraciones con estado (connected / not connected / expired)
- Banner de bloqueo en editor si no hay integracion

## Seguridad
- RLS: solo admin puede leer/escribir perfil e integraciones
- Tokens nunca en cliente
- Audit logs para cambios de perfil e integraciones

## Pendientes
- Seleccion de proveedor cloud real
- Implementacion de tokens via vault/edge functions


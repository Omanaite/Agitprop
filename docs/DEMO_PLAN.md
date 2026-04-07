# Live Demo Plan — Agitprop

## Objetivo
Permitir que un artista potencial vea la plataforma funcionando **antes de registrarse**,
tanto la web pública como el panel de administración (studio).

---

## Concepto

### Demo pública (web del artista)
Un tenant ficticio preconfigurado con datos de ejemplo:
- Slug: `demo` → accesible en `agitpropstudio.vercel.app/demo`
- Tema: rotativo (muestra varios temas con un selector)
- Contenido: galería con piezas de ejemplo, posts, tarifas, bio
- Booking deshabilitado (formulario muestra "This is a demo")

### Demo del studio (panel administrativo)
Un usuario demo que puede loguear y explorar el panel sin afectar datos reales:
- Credenciales públicas: `demo@agitprop.studio` / `demo1234`
- Tenant aislado (owner_user_id del usuario demo)
- Datos de ejemplo precargados (piezas, bookings, posts)
- Acciones de escritura: permitidas pero revertidas cada 24h via cron
- Notificaciones: deshabilitadas en modo demo

---

## Flujo de usuario

```
Landing page agitpropstudio.vercel.app
  → Botón "Ver demo en vivo"
    → Modal o página con dos opciones:
        [Ver mi sitio web →]   [Ver el panel artista →]
          ↓                         ↓
      /demo (pública)         /studio/login
                              (pre-rellena demo@agitprop.studio)
```

---

## Implementación técnica

### Fase 1 — Demo público (Easy, ~2h)
1. SQL: insertar tenant `demo` con datos de ejemplo en todas las tablas
2. `app/demo/page.tsx`: redirect a `/demo-artist-slug` o usar tenant existente
3. Banner "DEMO MODE" visible en la página pública
4. Booking form: muestra mensaje en vez de enviar

### Fase 2 — Demo studio (Medium, ~4h)
1. Crear usuario `demo@agitprop.studio` en Supabase Auth
2. Precargar datos de ejemplo (script o migration)
3. Middleware: detectar usuario demo → modo solo lectura en escrituras destructivas
4. Login page: botón "Entrar como demo" que pre-rellena las credenciales
5. Banner "DEMO — los cambios se revierten cada 24h" en el studio

### Fase 3 — Reset automático (Medium, ~2h)
1. Supabase Edge Function o cron job en Vercel
2. Cada 24h: borra datos del tenant demo y recarga desde seed
3. Usa `pg_cron` en Supabase o Vercel Cron

### Fase 4 — Selector de temas en demo (Hard, ~3h)
1. En la demo pública, barra flotante para cambiar de tema en vivo
2. Guarda preferencia en cookie (no en DB)
3. Muestra todos los temas disponibles con preview

---

## Consideraciones de diseño
- El botón "Ver demo" debe estar en la landing page principal (`/`) con copy claro
- No pedir email ni datos para ver el demo — frictionless
- El demo debe verse con datos reales (fotos de calidad, bio real de ejemplo)
- CTA claro al final del demo: "¿Te gusta? Crea tu cuenta gratis →"

---

## Priorización
- **Fase 1** primero — valor inmediato, bajo riesgo
- **Fase 2** agrega mucho valor para ventas B2B
- **Fase 3** necesaria para que la Fase 2 sea sostenible
- **Fase 4** diferenciador visual fuerte

---

## Para revisar / decidir
- [ ] ¿Usamos fotos reales o generamos con AI para el demo?
- [ ] ¿El demo del studio tiene funciones de escritura o es solo lectura?
- [ ] ¿Cuánto tiempo expira la sesión demo?
- [ ] ¿El demo necesita i18n (es/en)?
- [ ] ¿El artista demo tiene nombre real o ficticio?

---

*Creado: 2026-04-07 — Para discutir con Pablo antes de implementar*

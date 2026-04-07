# Live Demo Plan — Agitprop

## Objetivo
Permitir que un artista potencial vea la plataforma funcionando **antes de registrarse**,
tanto la web pública como el panel de administración (studio).

---

## Decisiones tomadas
- Fotos del tenant demo: **generadas con AI** (no fotos reales)
- Studio demo: **cambios en sesión** — se ven reflejados en la web demo en vivo, se revierten a los 10 minutos o al cerrar la pestaña
- Light/dark: **gratis** para todos
- Idiomas (i18n): **premium**

---

## Concepto

### Demo pública (web del artista)
Tenant ficticio preconfigurado con datos de ejemplo:
- Slug: `demo` → `agitpropstudio.vercel.app/demo`
- Tema: selector flotante (muestra todos los temas disponibles)
- Contenido: galería con piezas generadas por AI, posts, tarifas, bio
- Booking: formulario visible pero muestra "This is a demo — no booking saved"
- Banner superior: "DEMO MODE"

### Demo del studio (panel administrativo)
- Credenciales públicas: `demo@agitprop.studio` / `demo1234`
- Tenant aislado (owner_user_id del usuario demo)
- **Cambios en sesión**: el artista puede editar y ver los cambios en tiempo real en la web demo
- Persistencia: almacenada en memoria de sesión (Redis o Supabase con TTL de 10 min)
- Auto-revert: al expirar la sesión o cerrar pestaña, los datos vuelven al estado seed
- Notificaciones: deshabilitadas en modo demo

---

## ⭐ Idea clave: Studio Split-Screen (aplica a demo Y producción)

### Concepto
El panel del studio se divide en dos mitades:
- **Izquierda (50%)**: panel de administración normal
- **Derecha (50%)**: preview en vivo del sitio público del artista (iframe)

Al guardar cualquier cambio, el iframe de la derecha se recarga automáticamente
mostrando el resultado al instante — sin abrir nueva pestaña.

### En modo demo
Mismo split-screen pero los cambios **no se guardan en DB** —
se aplican solo al iframe vía estado local (React context / localStorage).
Al cerrar la pestaña o a los 10 minutos, todo vuelve al estado seed.

### Implementación técnica
```
StudioLayout (split)
├── Left: StudioConsoleShell (existente)
└── Right: <iframe src="/[slug]" /> con auto-refresh al guardar
    ├── Botón "Expand preview" (fullscreen del iframe)
    ├── Selector de dispositivo: desktop / tablet / mobile
    └── Botón "Open in new tab"
```

Comunicación: cuando el artista guarda (cualquier form), el layout emite un
evento `previewRefresh` que el iframe escucha y se recarga solo.

---

## Flujo de usuario

```
Landing page agitpropstudio.vercel.app
  → Botón "Ver demo en vivo"
    → Modal con dos opciones:
        [Ver mi sitio web →]       [Explorar el panel artista →]
              ↓                              ↓
         /demo (pública)           /studio/login
         (con selector de temas)   (pre-rellena demo@agitprop.studio)
                                          ↓
                                   Studio split-screen
                                   Left: panel | Right: /demo live
```

---

## Fases de implementación

### Fase 1 — Demo público (Easy, ~2h)
1. SQL seed: tenant `demo` con AI-generated content
2. `app/[slug]/page.tsx`: detectar slug `demo` → mostrar banner + deshabilitar booking
3. Selector de temas flotante en la demo

### Fase 2 — Studio split-screen (Medium, ~4h) ← PRIORIDAD ALTA
1. `app/studio/layout.tsx`: dividir en dos paneles con CSS grid
2. Iframe derecho apuntando a `/{slug}` del artista logueado
3. Evento `previewRefresh` emitido por StudioConsoleShell al guardar
4. Controles del preview: expand, dispositivo, open-in-tab

### Fase 3 — Demo del studio (Medium, ~4h)
1. Crear usuario `demo@agitprop.studio` en Supabase Auth
2. Middleware: detectar usuario demo → bloquear escrituras reales
3. Cambios demo: guardar en `sessionStorage` + reflejar en iframe
4. Auto-revert: TTL de 10 min via `setTimeout` + `beforeunload`
5. Botón "Entrar como demo" en `/studio/login`

### Fase 4 — Reset automático (Medium, ~2h)
1. Supabase Edge Function o Vercel Cron
2. Cada hora: restaurar datos del tenant demo desde seed

---

## Para revisar / decidir
- [x] Fotos: generadas con AI
- [x] Studio demo: cambios en sesión (10 min TTL)
- [x] Light/dark: gratis
- [x] Idiomas: premium
- [ ] ¿El split-screen es opt-in (botón) o siempre visible?
- [ ] ¿Qué ancho mínimo de pantalla activa el split? (¿colapsa en tablet?)
- [ ] ¿El selector de dispositivo en el preview (mobile/tablet/desktop)?

---

*Actualizado: 2026-04-07*

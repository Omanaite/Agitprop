# State Snapshot - Agitprop Studio

**Reglas obligatorias para todo agente:**
1. Leer sección **COORDINACIÓN** antes de tocar cualquier archivo
2. Registrar tu trabajo en COORDINACIÓN al empezar
3. Registrar la sesión en la **Bitácora** al terminar

Branch: `vercel` → auto-deploy en push
Production URL: https://agitpropstudio.vercel.app
Supabase project: `ffnrzvklegbiejlksnai`

---

## COORDINACIÓN — leer antes de empezar cualquier trabajo

> Si dos agentes editan el mismo archivo en paralelo habrá conflictos de merge.
> Antes de tocar un archivo, verifica que no esté en la columna "En progreso" de otro agente.
> Al terminar, mueve tu entrada a "Libre" o elimínala.

### En progreso ahora

| Agente | Archivos / área | Iniciado |
|--------|----------------|----------|
| — | — | — |

### Áreas libres (disponibles para trabajar)

- `app/api/payments/*` — smoke test PayPal
- `components/studio/StudioTelegramSettings.tsx` — smoke test
- `app/agitprop/*` — home/marketing
- `app/legal/*` — textos legales
- Cualquier archivo no listado en "En progreso"

### Protocolo

1. **Al empezar:** agrega tu fila en "En progreso" con los archivos que vas a tocar
2. **Si el archivo ya está en progreso:** espera o coordina con el usuario
3. **Al terminar:** elimina tu fila de "En progreso"
4. **Siempre:** `git pull` antes de empezar, `git push` al terminar cada bloque

---

## START HERE cada sesión

1. Leer sección COORDINACIÓN arriba ← obligatorio
2. `git log --oneline -5`
3. Continuar "Pendientes" o lo que indique el usuario

---

## Estado de producción

### DB — todo aplicado ✅
| Patch | Estado |
|-------|--------|
| `STUDIO_TENANT_OWNERSHIP_PATCH` | ✅ |
| `MVP_COMPLETION_PATCH` | ✅ |
| `BOOKINGS_TENANT_ISOLATION_PATCH` | ✅ |
| `ARTIST_SITE_THEMES_PATCH` | ✅ |
| Akemi backfill (`owner_user_id = 030ae67c-d882-4cfe-a6ae-d006fe6bf2ce`) | ✅ |
| `availability_slots` JSONB en `artist_tenants` | ✅ |
| `slot_id` + `slot_label` en `bookings` | ✅ |

### Datos clave Akemi
- Slug: `akemion-tattoo`
- Email: `akemi@tattoo.ink`
- plan_code: `expanded`
- site_theme: `akemi_brutalist` (reservado, solo piloto)

### Variables de entorno Vercel — pendientes de agregar
| Var | Uso | Estado |
|-----|-----|--------|
| `ANTHROPIC_API_KEY` | Chatbot studio (Claude Haiku) | ⚠️ falta en producción |
| `VERCEL_TOKEN` | Dominios custom (Vercel API) | ⚠️ falta en producción |
| `VERCEL_PROJECT_ID` | Dominios custom (Vercel API) | ⚠️ falta en producción |
| `VERCEL_TEAM_ID` | Dominios custom (opcional, si hay team) | opcional |

---

## Qué funciona en producción

- Registro email + OAuth (Google/GitHub)
- Login studio `/studio/login`
- Studio workspace: galerías, piezas, posts, secciones homepage, perfil, tarifas, disponibilidad multi-slot, bookings
- Disponibilidad multi-slot: bloques con días, horario, capacidad; selector en booking form público
- Booking reschedule por artista
- Thumbnails + lightbox en vista de piezas studio
- Cover image en lista de galerías studio
- Notificaciones Telegram por artista (bot propio vía BotFather)
- Dominio custom via Vercel API (UI lista, requiere env vars)
- Chatbot Claude Haiku en studio (requiere `ANTHROPIC_API_KEY`)
- PayPal per-artista (`payee.email_address` en purchase_units)
- Sitio público `/{slug}` — 6 themes
- Combobox unificado tema + idioma en header público
- i18n en/es/de gratis para todos los tiers
- SEO: metadata, sitemap, robots, JSON-LD, OG/Twitter
- Seguridad: CSP, rate limiting, honeypot, same-origin

---

## Modelo de negocio (fuente de verdad)

- **Todo gratis**: booking, galería, posts, temas, i18n, Telegram
- **Límite free** (`basic`): 2 galerías, 25 piezas, 5 posts
- **Expanded storage** (`expanded`): ilimitado — pago único, sin suscripción
- **Dominio custom**: costo Vercel sin markup — artista compra en Vercel, se conecta aquí
- **Dominio externo** (ej: propio hosting): acuerdo directo con el desarrollador
- No hay "premium", no hay "Studio Pro", no hay priority support

---

## Pendientes

### Bloqueante — requiere acción manual del usuario
1. **Agregar en Vercel Dashboard** → Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` (obtener en console.anthropic.com)
   - `VERCEL_TOKEN` (obtener en vercel.com/account/tokens)
   - `VERCEL_PROJECT_ID` (ID del proyecto en vercel.com)

### Código — siguiente a implementar
2. ✅ `StudioBookingsManager` — slot_label visible en booking cards (commit `53c2e07`)
3. Smoke test general producción (ver lista abajo — requiere verificación manual)

### Nice-to-have backlog
Ver `docs/POST_MVP_BACKLOG.md` para lista completa ordenada por dificultad.

---

## Smoke test (pendiente verificación manual)

- [ ] Registro con email nuevo
- [ ] Login email + OAuth Google/GitHub
- [ ] Formulario de contacto
- [ ] Booking público con slot selector (requiere slots configurados por artista)
- [ ] Booking reschedule desde studio
- [ ] Click en pieza → modal detalle
- [ ] Click en post → modal detalle
- [ ] Guardar nombre/slug en perfil
- [ ] Cambiar tema desde header público
- [ ] Cambiar idioma desde header público
- [ ] Crear/editar pieza con thumbnail visible en studio
- [ ] Configurar slot de disponibilidad y verificar que se deshabilita al llenarse

---

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `app/[slug]/page.tsx` | Sitio público artista — renderer dinámico |
| `app/akemi/page.tsx` | Ruta legacy Akemi hardcoded |
| `app/studio/login/actions.ts` | Login action studio |
| `app/register/actions.ts` | Registro via admin API (sin SMTP) |
| `app/agitprop/page.tsx` | Home del proyecto — modelo free/expanded |
| `app/legal/agb/page.tsx` | Términos y Condiciones (alemán + español) |
| `components/BookingForm.tsx` | Formulario público con slot selector |
| `components/studio/StudioAvailabilityManager.tsx` | Multi-slot availability editor |
| `components/studio/StudioGalleryManager.tsx` | Piezas con thumbnails + lightbox |
| `components/studio/StudioGalleriesManager.tsx` | Galerías con cover image |
| `components/studio/StudioBookingsManager.tsx` | Bookings + reschedule (falta slot_label) |
| `components/studio/StudioTelegramSettings.tsx` | Config bot Telegram por artista |
| `components/studio/StudioSiteSettings.tsx` | Tema + dominio custom |
| `components/studio/StudioChatbot.tsx` | Chatbot Claude Haiku en studio |
| `components/SitePreferencesMenu.tsx` | Combobox tema+idioma en header público |
| `components/PaymentButtons.tsx` | PayPal per-artista con approvalUrl |
| `app/api/studio/availability-slots/route.ts` | CRUD slots por artista |
| `app/api/public/availability-slots/route.ts` | Slots públicos con conteo capacidad |
| `app/api/studio/telegram/route.ts` | GET/PUT/DELETE/POST(test) config Telegram |
| `app/api/studio/domain/route.ts` | GET/PATCH/DELETE dominio custom via Vercel API |
| `app/api/studio/chat/route.ts` | Chatbot — proxy a Claude Haiku |
| `app/api/payments/paypal/route.ts` | Crear orden PayPal per-artista |
| `app/api/payments/paypal/capture/route.ts` | Capturar pago PayPal |
| `lib/telegram.ts` | sendTelegramMessage + buildBookingTelegramMessage |
| `lib/validators.ts` | Zod schemas — incluye slot_id/slot_label en bookingSchema |
| `lib/tenants/plan.ts` | Límites por tier (canAddGallery, etc.) |
| `proxy.ts` | Auth guard (Next 16) |
| `docs/POST_MVP_BACKLOG.md` | Backlog ordenado por dificultad |
| `docs/ENGINEERING_CONTEXT.md` | Skills como funciones — leer antes de cargar skill |

---

## Reglas de arquitectura

- APIs artista: `/api/studio/*` — nunca `/api/admin/*`
- Auth guard: `proxy.ts` (Next 16)
- Theme entitlement: `lib/tenants/theme.ts` — `akemi_brutalist` reservado
- Todos los POST/PATCH/PUT: `enforceSameOrigin()` + `rateLimit()` + `requireArtistOperator()`
- Commits: `feat:`, `fix:`, `docs:`, `chore:`
- Push a `vercel` → deploy automático en Vercel

---

## Bitácora de sesiones

### 2026-04-14 — Sesión 2 (continuación)
**Build fix:** Zod v4 breaking changes en `app/register/actions.ts` — `errorMap` → `error`, `.refine()` → `.superRefine()`. Build limpio.

**Disponibilidad multi-slot:**
- Reescritura completa de `StudioAvailabilityManager.tsx` — lista de bloques, editor inline, días toggle, capacidad, nota
- `app/api/studio/availability-slots/route.ts` — GET/PUT para artista
- `app/api/public/availability-slots/route.ts` — GET público con conteo de capacidad por fecha

**BookingForm rediseñado:**
- Date picker → fetch slots disponibles para ese día
- Selector visual de slots; llenos = deshabilitados
- `slot_id` + `slot_label` en payload → guardados en DB

**Thumbnails studio:**
- `StudioGalleryManager`: miniatura 64×64 + lightbox al click
- `StudioGalleriesManager`: cover image (primer piece de cada galería)
- Galleries API: adjunta `cover_image` desde `gallery_items`

**Modelo de negocio:**
- Home (`app/agitprop/page.tsx`): quitado todo lo de "premium", ahora free/expanded storage
- AGB actualizado: sin suscripciones, límites reales, Vercel domain pricing, dominio externo = acuerdo con desarrollador
- i18n gratis para todos — eliminado gate por tier

**Otras features de la sesión:**
- Telegram por artista: `StudioTelegramSettings`, `/api/studio/telegram`, `lib/telegram.ts`
- Dominio custom: `StudioSiteSettings` sección dominio, `/api/studio/domain` (Vercel API)
- ChatBot: `StudioChatbot`, `/api/studio/chat` (Claude Haiku)
- PayPal per-artista: `payee.email_address` en purchase_units, flujo approvalUrl
- Combobox unificado tema+idioma: `SitePreferencesMenu`

**Coordinación multi-agente:**
- Sección COORDINACIÓN agregada a STATE.md con tabla "En progreso" y protocolo
- Regla establecida: chequear COORDINACIÓN antes de empezar cualquier trabajo

**Commits clave:**
- `8f8fe84` docs: STATE.md actualizado + bitácora
- `a0a0158` fix: zod v4 compat
- `3061662` feat: BookingForm slot selector
- `3929890` feat: multi-slot availability, thumbnails
- `acb2541` fix: modelo de negocio correcto

### 2026-04-18 — Sesión 4

**Sync datos reales del operador:**
- `lib/legal/templates.ts` — Steuernummer real (80 732 336 158), kleinunternehmer: false

**Reminder email (Backlog item 5):**
- `vercel.json` — Vercel Cron `0 8 * * *`
- `app/api/cron/booking-reminders/route.ts` — busca bookings confirmed para mañana, envía email por Resend
- Requiere: `CRON_SECRET` en Vercel env vars (agregar en Vercel Dashboard)

### 2026-04-14 — Sesión 3

**Skills → funciones backend (3 skills eliminadas del registry):**
- `desing-user-specs` → `lib/tenants/akemi-pilot.ts`
- `agent-teams-lite` → `lib/agents/orchestrator.ts` (state machine SDD)
- `spec-kit-command-cursor` → `lib/agents/spec-runner.ts`
- `terms-page-generator` → `lib/legal/templates.ts`
- `ENGINEERING_CONTEXT.md` — tabla skills→funciones + aviso coordinación multi-agente

**Páginas legales:** `app/legal/` — Impressum, AGB, Datenschutz con datos reales del operador.

**Location autocomplete:** `components/studio/LocationSearch.tsx` — Nominatim, reemplaza 2 inputs en `StudioGalleryManager`.

**Terms acceptance en registro:**
- Email: checkbox en `RegisterForm.tsx` + validación Zod en `actions.ts`
- OAuth: `OAuthTermsGate.tsx` en `/register/complete` — botón bloqueado hasta aceptar

**Verificados como ya completos:** editable body text, booking email notification, location display.

### 2026-04-05 — Sesión 1
MVP completado. Todas las migraciones SQL aplicadas en producción. Funcionalidades base: registro, login, studio workspace, sitio público, SEO, seguridad.

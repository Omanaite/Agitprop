﻿﻿﻿# Devlog

Document role: Canonical
Owner: Documentation traceability
Scope: Chronological implementation history, including agent and model trace
Last updated: 2026-04-29

Purpose: chronological project progress log to preserve context across sessions.

## 2026-05-05
**Agent:** claude-sonnet-4-6

- **theme redesign** (`NavAtelier`, `NavMono`, `NavInk`, `NavVerdure`, `NavAmber`): Full per-theme hamburger menus + animated overlays
  - **Atelier**: 2-line editorial hamburger → split-screen fullscreen overlay (fg left column + staggered right nav items, `translateX` enter)
  - **Mono**: 3×3 dot grid hamburger → fullscreen terminal grid layout, items in CSS grid with `translateY` stagger
  - **Ink**: square bordered SVG icon → fullscreen dramatic `translateY(-8px)` drop, accent underline on hover via ref
  - **Verdure**: 3-line rounded + accent middle line → bottom-sheet panel slides up `translateY(100%)→0`, botanical ❧ ornaments
  - **Amber**: art deco thin/thick/thin lines → center-emerge overlay with ◆ corner decorators + staggered `scale(0.96)→1`
  - All: `cubic-bezier(0.16,1,0.3,1)` easing, `document.body.overflow` lock, `mounted` state for unmount delay
- **MktThemeToggle** (`components/marketing/MktThemeToggle.tsx`): replaced emoji icons with inline SVG thin-stroke 16px (sun/moon/eye)

## 2026-04-30
**Agent:** claude-sonnet-4-6 | `2027aa5` `bce7d5b` `84e9fa1` `34909bf` `9c01343`

- **1.3 + 1.4** (`NavInk.tsx`): eyebrow `text-[9px]` → `text-[10px]` en header y overlay; tracking overlay `1.2em` → `0.6em`
- **5.2** (`SitePreferencesMenu.tsx`): `aria-label="Site preferences"` en botón toggle
- **1.2** (`NavAtelier.tsx`, `NavInk.tsx`): Atelier `md:text-8xl` → `md:text-7xl`; Ink `text-xl md:text-3xl` → `text-3xl md:text-5xl`
- **7.2** (`ContactForm.tsx`): spinner SVG animado durante envío + `disabled:opacity-40 disabled:cursor-not-allowed`
- **9.3**: ya estaba implementado (`active { transform: scale(0.98) }`)
- **fix: preview iframe** (`lib/studio-preview-context.tsx`, `StudioPreviewPanel.tsx`): BroadcastChannel no funciona en iframe sandboxed — eliminado. Refresh usa solo `previewKey` increment. Agregado `allow-popups` al sandbox para que ↗ abra en nueva pestaña.
- **8.2**: tokens `--ease-out-expo` y `--transition-speed` ya en `:root`; BookingForm/PostFeed no tenían hardcoded — cubierto
- **6.1** (`app/globals.css`): `.hard-border` con `transition` + `:hover`/`:focus` → `border-color: var(--accent)`
- **6.3** (`studio/LocationSearch.tsx`): estado `fetchError` con mensaje visible cuando Nominatim falla
- **4.3**: padding inputs ya unificado en `px-3 py-2`; no requirió cambio
- **2.3**: studio hardcodeado en inglés por decisión de arquitectura — sin sistema i18n en panel artista
- **5.2** (`SitePreferencesMenu.tsx`): agregado `aria-label="Site preferences"` al botón toggle del dropdown
- **1.2** (`NavAtelier.tsx`, `NavInk.tsx`): títulos normalizados — Atelier `md:text-8xl` → `md:text-7xl`; Ink `text-xl md:text-3xl` → `text-3xl md:text-5xl`

## 2026-04-30
**Agent:** Gemini Code Assist | **Model:** Gemini 2.5

- **Dynamic Demo Link** (`app/agitprop/page.tsx`): Conversión a Async Server Component para resolver dinámicamente el slug de Akemi (`akemi@tattoo.ink`) usando su `owner_user_id` fijo. Añadida revalidación de 1 hora (ISR).
- **Governance Update**: Actualización obligatoria del protocolo de coordinación en `STATE.md`, `SDLC_QUALITY_STANDARD.md` y `ENGINEERING_CONTEXT.md`. Se establece el uso imperativo de la tabla de coordinación para "conversar" entre agentes y resolver conflictos, incluso en sesiones individuales.
- **Theme Audit (Structural Failure)**: Verificación de la homogeneidad visual de los temas. Se identifica que las variables estructurales inyectadas previamente no están afectando el layout debido a clases de Tailwind estáticas que sobreescriben el diseño.
- **Theme Structural Correction**: Implementación de un motor de galería en `app/globals.css` y `components/GalleryGrid.tsx` para permitir layouts estructurales dinámicos por tema (Atelier = columna, Mono = grid denso, Ink = scroll horizontal, etc.).
- **Accessibility 5.4 (GalleryGrid)**: Convertido `<article role="button">` a `<button>` semántico en `components/GalleryGrid.tsx` para mejorar la accesibilidad.
- **Accessibility 5.5 (WCAG Contrast)**: Reemplazado `opacity-40` por `text-[var(--muted)]` en `components/GalleryGrid.tsx` y `app/agitprop/page.tsx` para mejorar el contraste WCAG. Se han añadido definiciones de `--muted` a todos los temas en `app/globals.css`.
- **Accessibility 5.5 (BookingForm)**: Eliminación de opacidades bajas en `BookingForm.tsx` reemplazándolas por la variable semántica `--muted` del tema.
- **Motion 8.2 (BookingForm)**: Aplicación de tokens de movimiento `--ease-out-expo` y `--transition-speed` a botones y transiciones de estado en el formulario de reserva.

## 2026-04-30
**Agent:** claude-sonnet-4-6 | **Session:** world-class marketing redesign + UX polish (IMPROVEMENT_PLAN.md)

- **Marketing page redesign** (`app/agitprop/page.tsx`): Full rewrite using `.marketing-shell` token system. Editorial asymmetric 7/5 grid hero, sticky nav with backdrop blur, theme marquee, features 3-col grid, pricing with recommended badge, steps with large display numbers, big CTA section, audience tags (Tattoo/Illustration/Photography/Design) replacing tech stack tags.
- **Font system** (`app/layout.tsx`): Added Geist, Geist Mono, Space Grotesk via `next/font/google`; CSS variables `--font-mkt-display`, `--font-mkt-sans`, `--font-mkt-mono` on `<body>`.
- **Marketing token system** (`app/globals.css`): `.marketing-shell` with `--mkt-*` variables, 3 theme variants (`data-theme`), utility classes: `.mkt-button`, `.mkt-button-primary`, `.mkt-card`, `.mkt-card-hover`, `.mkt-chip`, `.mkt-tag`, `.mkt-display`, `.mkt-mono`, `.mkt-muted`, `.mkt-divider`.
- **Motion tokens** (`app/globals.css`): `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`, `--transition-speed: 200ms`, `@keyframes marquee`, `@keyframes panel-enter`, `.admin-panel-enter`.
- **Type scale tokens** (`app/globals.css`): `--type-*` and `--track-*` tokens; applied to `Section.tsx`, `Footer.tsx`.
- **Focus/disabled states** (`app/globals.css`): `#theme-root :focus-visible` ring (2px, var(--accent)), `button:disabled` opacity-40 + cursor-not-allowed.
- **Admin transitions** (`app/globals.css`): ease → `cubic-bezier(0.16,1,0.3,1) 200ms` on all admin button/input elements.
- **Gallery filter select** (`app/globals.css`): option bg/fg from hardcoded hex → `var(--bg)/var(--fg)`.
- **AnimatePresence validation** (`ContactForm.tsx`, `BookingForm.tsx`): Replaced static `<p>` with `motion.p` + AnimatePresence; added `aria-invalid`, `aria-describedby`, `role="alert"` on all fields; removed field-name prefixes from error messages.
- **BroadcastChannel preview refresh** (`lib/studio-preview-context.tsx`, `components/PreviewRefreshListener.tsx`, `app/[slug]/page.tsx`): Cross-context reload via `BroadcastChannel("agitprop-preview-refresh")`; `PreviewRefreshListener` injected into public tenant page.
- **Preview panel polish** (`components/studio/StudioPreviewPanel.tsx`): Width transition to expo curve; read-only overlay (`pointerEvents: all`) prevents iframe navigation.
- **Panel enter animation** (`components/studio/StudioConsoleShell.tsx`): Added `admin-panel-enter` class to `TabPanel`.
- **Circular font var fix** (`app/globals.css`): Removed self-referencing `var(--font-heading)`.

## 2026-04-30 (Theme Redesign & Structural Layouts)
**Agent:** Gemini Code Assist | **Model:** Gemini 1.5 Pro (Workspace Context)

- **Theme Redesign (Palettes & Visual Tokens)**: Updated color palettes, border radii, and font families for Atelier, Mono, Ink, Verdure, and Amber (and their B variants) in `app/globals.css` to align with Emil Kowalski, Impeccable, and Taste Design principles.
- **Structural Layouts for Themes**: Introduced CSS variables (`--layout-max-width`, `--gallery-columns`, `--nav-alignment`, `--gallery-display`, `--gallery-overflow`) in `app/globals.css` to enable distinct structural layouts for each theme.
  - **Atelier**: Narrow central column, single-piece gallery, bottom-only borders on cards.
  - **Mono**: Rigid grid with zero gap, shared borders on cards, technical font.
  - **Ink**: Horizontal scroll gallery with `scroll-snap`, cinematic feel.
  - **Verdure**: Staggered vertical layout for gallery cards, pill-shaped buttons.
  - **Amber**: Rotated gallery cards with hover-to-straighten effect, solid offset shadows.
- **Font Imports**: Added `EB_Garamond`, `Inter`, `Outfit`, `Fraunces` to `app/layout.tsx` and linked them to CSS variables for each theme.
- **B Variants Synchronization**: Ensured that the B variants of each theme inherited the structural layout changes of their A counterparts, providing distinct experiences beyond just color.

## 2026-04-29
- Enabled `impeccable` for the workspace root by adding shared context files:
  - `../PRODUCT.md`
  - `../DESIGN.md`
  - `../IMPECCABLE_SETUP.md`
- Installed and verified the Emil Kowalski skill in the workspace:
  - `../.agents/skills/emil-design-eng/SKILL.md`
- Added local wrappers so `impeccable` can run even when `node` is not on `PATH`:
  - `../scripts/impeccable.ps1`
  - `../scripts/impeccable.cmd`
- Verified end-to-end that `impeccable` context loading works from the workspace root using the discovered Node runtime at `C:\nvm4w\nodejs\node.exe`.
- Updated project workflow rules so every future feature, fix, or docs-relevant implementation must register:
  - devlog entry
  - agent used
  - model used
- Updated UI/UX process guidance so frontend design, audit, and new surface creation should use this skill baseline:
  - `impeccable`
  - `emil-design-eng`
  - `design-taste-frontend`
- Added document-role headers across major docs to classify each file as:
  - canonical
  - support
  - milestone-specific
  - derived
  - agent-adapter
  - proposed plan
- Agent used for this implementation: `Codex`
- Model used for this implementation: `GPT-5-based Codex runtime (exact model variant not exposed in-session)`

## 2026-03-24
- Formalized MVP signoff documents:
  - `docs/MVP_STATUS.md`
  - `docs/PENDING_EXTERNAL_INTERVENTIONS.md`
  - `docs/POST_MVP_BACKLOG.md`
- Refreshed project docs for continuity (`ROADMAP`, `STATE`, `MASTER_DOCUMENT`, `NOTEBOOKLM`).

## 2026-03-26
- Fixed public image regressions by broadening remote host support for Next image.
- Restored admin gallery single and bulk file uploads by removing unintended integration-based disable state.

## 2026-03-31
- Fixed OAuth button navigation behavior by switching provider CTA to standard anchor navigation (prevents Next API prefetch query noise).
- Added resilient admin auth check via shared helper (`role`, `roles`, and optional allowlist support).
- Added safe fallbacks in profile/integrations APIs when production schema is missing (`admin_profiles`, `admin_integrations`) to avoid hard 500 failures.
- Added `admin_payment_settings` API + admin UI section for Stripe/PayPal references and operation mode (`test/live`).
- Extended `supabase/schema.sql` with:
  - `admin_profiles`
  - `admin_integrations`
  - `admin_payment_settings`
  - RLS + admin policies for those tables.
- Registered new roadmap items for:
  - payments sandbox progression
  - SaaS foundation (platform admin, plan gating)
  - scheduling and availability module.
- Started product rebrand from project-level naming to **Agitprop** while preserving Akemi as pilot tenant.
- Added new public service route `/agitprop` with:
  - value proposition blocks
  - Free vs Premium framing
  - CTA flow to `/register`, `/admin/login`, and pilot homepage.
- Updated roadmap/spec artifacts to include service-page conversion funnel and pending SEO/localization tasks for this surface.

## 2026-03-31 (follow-up)
- Hardened `GET /api/admin/profile` to avoid hard 500 for recoverable schema/policy drift:
  - removed strict dependency on `id` column in select projection
  - added fallback behavior for missing-column / privilege mismatch cases
- Added SaaS foundation backlog item for full artist-tenant lifecycle controls in platform admin:
  - edit
  - activate/deactivate
  - delete with audit trail

## 2026-03-31 (platform scope clarification)
- Registered product decision: split current mixed admin into two role-scoped consoles.
  - Platform Admin Console (SaaS operations)
  - Artist Workspace (content/site management)
- Recorded that platform admin should not directly manage artist content modules:
  - homepage
  - posts
  - galleries
  - pieces
- Added platform-governance requirements:
  - role and permission management
  - tenant lifecycle controls
  - global integration enable/disable switches for maintenance windows

## 2026-03-31 (role-scoped console implementation)
- Implemented first UI split:
  - `/admin` now serves Platform Admin Console scope only.
  - `/studio` now serves artist content workspace.
- Updated auth routing:
  - login redirects users to role-appropriate console (`/admin` or `/studio`).
  - proxy enforces route access by role and prevents cross-scope access.
- Kept platform console intentionally free of artist content modules to align with SaaS governance model.

## 2026-03-31 (platform governance foundation)
- Added SaaS schema foundation in `supabase/schema.sql`:
  - `artist_tenants`
  - `tenant_memberships`
  - `platform_integrations`
- Added platform admin APIs:
  - `GET/PUT /api/admin/platform-tenants`
  - `GET/PUT /api/admin/platform-integrations`
- Added platform governance UI module in platform console for:
  - tenant status and plan control
  - global integration maintenance switches

## 2026-03-31 (tenant auto-provisioning)
- Added tenant bootstrap service (`lib/tenants/provision.ts`).
- Registration and OAuth callback now attempt to provision tenant records automatically for non-platform users:
  - create tenant in `artist_tenants`
  - create owner membership in `tenant_memberships` with `artist_admin` role
- Provisioning failures are intentionally non-blocking for auth flow continuity.
- Added reusable SQL patch at `docs/sql/SAAS_FOUNDATION_PATCH.sql` for idempotent rollout in Supabase.

## 2026-03-31 (artist login visibility)
- Added dedicated artist login route: `/studio/login`.
- Updated proxy behavior so unauthenticated `/studio/*` requests redirect to `/studio/login`.
- Updated service page CTAs to expose:
  - Artist login (`/studio/login`)
  - Platform admin login (`/admin/login`)
- Updated registration policy:
  - register page now supports email/password only
  - OAuth entry moved to artist login to avoid duplicate sign-up surfaces

## 2026-03-31 (oauth documentation)
- Added `docs/OAUTH_GOOGLE_SETUP.md` with:
  - required Google redirect URI for Supabase callback
  - Supabase provider and URL configuration checklist
  - smoke-test steps
  - security guidance for client secret handling/rotation

## 2026-03-31 (studio 403 hotfix)
- Fixed artist workspace 403 noise by removing direct dependency on `/api/admin/*` endpoints from `/studio`.
- Added `StudioWorkspaceShell` as transition-safe role-scoped surface while artist-scoped API layer is implemented.

## 2026-03-31 (artist-scoped settings APIs)
- Implemented artist-specific endpoints:
  - `GET/PUT /api/studio/profile`
  - `GET/PUT /api/studio/payment-settings`
- Added artist workspace modules:
  - `StudioConsoleShell`
  - `StudioProfileManager`
  - `StudioPaymentSettingsManager`
- Replaced transitional studio placeholder with functional settings workspace backed by `/api/studio/*`.
- Result: artist `/studio` no longer depends on platform-admin APIs for profile/payment operations.

## 2026-04-01 (studio integrations API baseline)
- Added `GET/POST /api/studio/integrations` with artist auth guard and user-scoped storage access.
- Added `StudioIntegrationsManager` to artist workspace navigation.
- Wired studio OAuth connect action to `/api/auth/oauth?provider=...&next=/studio`.
- Strengthened studio profile/payment endpoints to use server-side service-role client after artist auth validation, avoiding admin-RLS dependency for artist users.

## 2026-04-01 (studio content API migration baseline)
- Added artist-scoped content endpoints:
  - `GET/POST /api/studio/galleries`
  - `PUT/DELETE /api/studio/galleries/[id]`
  - `GET/POST /api/studio/gallery-items`
  - `PUT/DELETE /api/studio/gallery-items/[id]`
  - `GET/POST /api/studio/posts`
  - `PUT/DELETE /api/studio/posts/[id]`
  - `GET/PUT /api/studio/homepage-sections`
  - `POST /api/studio/uploads`
- Added studio UI modules for homepage, galleries, pieces, and posts using `/api/studio/*` paths.
- Studio now runs with artist-scoped routes end-to-end for settings + content baseline.

## 2026-04-01 (studio ownership isolation hardening)
- Added owner-scoped filtering on studio content endpoints (`galleries`, `tattoos`, `posts`, `homepage_sections`).
- Writes now attach `owner_user_id` in studio content mutations to avoid cross-artist visibility.
- Added schema-guarded fallback behavior when ownership columns are not present (`code: schema_missing`, HTTP 503 for write-sensitive routes).
- Added SQL rollout patch: `docs/sql/STUDIO_TENANT_OWNERSHIP_PATCH.sql`.

## 2026-04-01 (platform tenant lifecycle baseline)
- Expanded platform tenant API with:
  - `POST /api/admin/platform-tenants` for tenant creation
  - `DELETE /api/admin/platform-tenants` for tenant deletion
- Tenant creation now also upserts owner membership (`tenant_memberships`) with `artist_admin` role.
- Platform governance UI now supports:
  - create tenant (owner UUID + studio name + slug + plan)
  - delete tenant from admin console

## 2026-04-01 (entrypoint routing update)
- Root route `/` now redirects to `/studio/login` to match SaaS-first navigation.
- Akemi pilot public site moved to dedicated route `/akemi`.
- SEO surface updated:
  - sitemap now prioritizes `/agitprop` and includes `/akemi`
  - robots now allows `/agitprop`, `/akemi`, `/galleries` and disallows `/studio`


## 2026-04-01 (tenant slug public sites and theme entitlement policy)
- Added tenant public slug-site foundation:
  - new route `app/[slug]/page.tsx` resolves active tenant and renders isolated public site by `owner_user_id`.
  - tenant-aware reads now supported in public data loaders (`galleries`, `tattoos`, `posts`, `homepage_sections`).
- Added tenant theme entitlement policy:
  - shared sanitizer in `lib/tenants/theme.ts`.
  - reserved `akemi_brutalist` for Akemi pilot identity exclusively.
  - non-Akemi tenants restricted to allowed defaults: `atelier`, `mono`, `ink`.
- Extended platform tenant schema surface in code:
  - `site_theme` and `custom_domain` fields now supported in validator and API payloads.
  - Platform admin tenant create/edit UI now accepts `site_theme` and `custom_domain`.
- Added schema updates in `supabase/schema.sql` for:
  - `artist_tenants.site_theme`
  - `artist_tenants.custom_domain`
  - site-theme constraint and idempotent FK creation guards.
- Added SQL rollout patch: `docs/sql/ARTIST_SITE_THEMES_PATCH.sql`.
- Sitemap now includes active tenant slugs for public indexing.
- Per-tenant SEO: metadata and canonical tags now scoped to the resolved tenant slug.

## 2026-04-01 (tenant gallery detail route and custom domain resolution)
- Added tenant-scoped gallery detail route `app/[slug]/gallery/[gallerySlug]/page.tsx`:
  - content isolation enforced by `owner_user_id` matching the resolved tenant.
- Fixed bug in `app/[slug]/page.tsx` where gallery links pointed to `/galleries/:slug` (Akemi-global route) instead of the correct `/${slug}/gallery/:gallerySlug` tenant-scoped path.
- Extended `proxy.ts` with custom domain resolution:
  - non-platform hostnames are looked up against `artist_tenants.custom_domain` and transparently rewritten to `/{slug}`.
  - proxy matcher expanded to cover all non-asset paths.

## 2026-04-27
- Auditoría completa del `IMPROVEMENT_PLAN.md` bajo los frameworks de Emil Kowalski, Impeccable y Taste Design.
- Reformulación del plan de mejoras inyectando:
  - Escala tipográfica editorial con tracking negativo.
  - Sistema de foco custom de alta precisión.
  - Protocolo de micro-interacciones (spring motion + tactile feedback).
  - Unificación de tokens de radio de borde.
- Adición de botón "Demo (Piloto)" en la página principal de Agitprop (`/agitprop`), enlazando a `/akemi` con animaciones sutiles.

## 2026-04-29
- Auditoría de diseño aplicada a `app/agitprop/page.tsx` y `IMPROVEMENT_PLAN.md`.
- Refinamiento de tracking tipográfico y curvas de animación (Emil Kowalski / Taste Design).
- Implementación física del botón "Demo (Piloto)" en el Hero de `app/agitprop/page.tsx` enlazando al sitio de Akemi.
- Agent: Gemini Code Assist
- Model: Gemini 1.5 Pro (Workspace Context)

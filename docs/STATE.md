# State Snapshot - Agitprop (Akemi Pilot)

Date: 2026-04-05
Branch: `vercel` → auto-deploy on push
Production URL: https://agitpropstudio.vercel.app
Supabase project: ffnrzvklegbiejlksnai

---

## START HERE every session

### 1. Read this file top to bottom
### 2. Check last commit: `git log --oneline -5`
### 3. Ask the user what to work on, or continue "Next Actions" below

---

## MVP Status: COMPLETE ✅

All SQL patches applied in production:
- `STUDIO_TENANT_OWNERSHIP_PATCH` ✅
- `MVP_COMPLETION_PATCH` ✅
- `BOOKINGS_TENANT_ISOLATION_PATCH` ✅
- `ARTIST_SITE_THEMES_PATCH` ✅
- Akemi backfill (owner_user_id = `030ae67c-d882-4cfe-a6ae-d006fe6bf2ce`) ✅

Akemi tenant slug in DB: `akemion-tattoo` (not "akemi")
Akemi email: `akemi@tattoo.ink`
Akemi site_theme: `akemi_brutalist` (reserved, pilot-only)

---

## What works in production

- Registration (email, no SMTP) + OAuth (Google/GitHub)
- Studio login `/studio/login` with own action
- Studio workspace: galleries, pieces, posts, homepage sections, profile, rates, availability, bookings
- Booking reschedule by artist (inline date picker)
- Public site `/{slug}` — dynamic renderer, 5 themes + akemi_brutalist
- Public piece detail modal (tags, duration, location link)
- Public post feed with date + full content modal
- Rates section on public site (from DB JSONB)
- Availability shown in booking form
- BookingForm validates against artist's available weekdays
- i18n en/es/de (UI labels only — content data not translated)
- SEO: metadata, sitemap, robots, JSON-LD, OG/Twitter images
- Security: CSP, rate limiting, honeypot, same-origin enforcement

---

## Next Actions (priority order)

### 1. 🔴 IMPLEMENT FIRST — Editable section body text
Every section (hero, about, work, etc.) should let the artist write their own body text.
Currently hardcoded. Critical for multi-artist use.

Steps:
- SQL: `ALTER TABLE homepage_sections ADD COLUMN body text;`
- Apply via Supabase MCP (`mcp__supabase__apply_migration`)
- Update `getHomepageSections` in `lib/data/homepage-sections.ts` to SELECT body
- Update `HomepageSection` type in `types/index.ts` to add `body?: string | null`
- Add textarea to section editor in `components/studio/StudioHomepageSectionsManager.tsx`
- Update section renderers in `app/[slug]/page.tsx` to use `section.body` instead of hardcoded text
- For Akemi's about: her current bio is in `lib/i18n.ts` under `about.body1` / `about.body2` — migrate to DB on first save

### 2. Location display + autocomplete
- Show place name (e.g. "Leipzig, Sachsen") instead of "View Location ↗" in piece modal
- Replace URL input in piece editor with Nominatim geocoding search (free, no API key)
- Debounce 300ms, dropdown with results, on select stores name + Maps URL
- DB: add `location_name text` column to tattoos table

### 3. Smoke test pending verification
User is testing production. When done, report any failures:
- Registration (email + OAuth)
- Login (email + OAuth)
- Contact form
- Booking reschedule
- Piece detail modal click
- Post detail modal click
- Profile nickname save (fix deployed: nullish transform on zod schema)

### 4. Post-MVP features (see POST_MVP_BACKLOG.md for full list)
Ordered by difficulty in that file. After items 1-3 above are clear:
- Notification email to artist on new booking
- i18n expansion to content data (posts, pieces, galleries)
- Reminder email to client before appointment
- Calendar view for artist
- Payments (Stripe/PayPal sandbox)

---

## Key files

| File | Purpose |
|------|---------|
| `app/[slug]/page.tsx` | Public artist site — dynamic renderer |
| `app/akemi/page.tsx` | Legacy Akemi hardcoded route (keep for now) |
| `app/studio/login/actions.ts` | Studio-specific login action |
| `app/register/actions.ts` | Registration via admin API (no SMTP) |
| `components/studio/StudioBookingsManager.tsx` | Bookings + reschedule UI |
| `components/studio/StudioHomepageSectionsManager.tsx` | Section editor |
| `components/GalleryGrid.tsx` | Public piece grid + detail modal |
| `components/PostFeed.tsx` | Public post feed + detail modal |
| `lib/tenants/theme.ts` | Theme policy — AKEMI_SLUG = "akemion-tattoo" |
| `lib/availability.ts` | Shared DEFAULT_AVAILABILITY |
| `lib/i18n.ts` | Akemi's about text (to be migrated to DB) |
| `lib/validators.ts` | Zod schemas — site_theme enum includes verdure/amber |
| `proxy.ts` | Auth guard (Next 16 — not middleware.ts) |
| `docs/POST_MVP_BACKLOG.md` | Full backlog ordered by difficulty |

---

## Architecture rules (do not break)

- Artist APIs: `/api/studio/*` — never `/api/admin/*`
- Auth guard: `proxy.ts` (Next 16 convention)
- Theme entitlement: `lib/tenants/theme.ts` — akemi_brutalist reserved
- All POST/PATCH/PUT: `enforceSameOrigin()` + `rateLimit()` + `requireArtistOperator()`
- Commits prefixed: `feat:`, `fix:`, `docs:`, `chore:`
- Push to `vercel` branch → triggers Vercel deploy → promote preview to production manually

---

## Supabase MCP
Available via `.mcp.json` at repo root.
Project ID: `ffnrzvklegbiejlksnai`
Use `mcp__supabase__apply_migration` for DDL, `mcp__supabase__execute_sql` for queries.

# Post-MVP Backlog

Date: 2026-04-05
Status: Active — ordered by implementation complexity (easiest first)

## Goal
Capture the next evolution of the product after MVP is accepted, with a path toward a configurable SaaS platform for tattoo artists or adjacent creative studios.

---

## Priority Queue — ordered by difficulty (fast wins first)

### 🟢 Easy (days)

**0. Editable section body text** ← PRIORITY
Every section (hero, about, etc.) should let the artist write their own body text, not just the title.
Implementation:
- Add `body text` column to `homepage_sections` table (migration)
- Add textarea to the section editor in Studio → Site
- Slug page renders `section.body` instead of hardcoded strings
- Fallback to generic text if body is empty
This replaces all hardcoded copy (Akemi's Berlin bio, hero tagline, etc.) with artist-controlled content.


**1. Location display + autocomplete on piece editor**
Two sub-tasks:
- **Display**: In the public piece detail modal, show the place name (e.g. "Leipzig, Sachsen, Deutschland") instead of "View Location ↗". The link should still open Google Maps. Requires storing `location_name` separately from `location_link` (or parsing the stored value).
- **Autocomplete input**: Replace the plain URL input in the piece editor with a geocoding search. User types 3+ characters → dropdown with options (district · city · country). On select, stores place name + Google Maps URL automatically. Use Nominatim (free, no API key) or Photon. Debounce 300ms.

**2. Booking notification email to artist**
When a client submits a booking, send a summary email to the artist's registered address.
Already have Resend configured. Just add `resend.emails.send()` call in `/api/bookings/route.ts` after insert.
Optional: make it a toggle in Studio settings.

**3. Final editorial QA pass**
Replace placeholder copy in `about` section, footer, and any hardcoded strings before indexing.
Decide if `/register` stays `noindex`.

### 🟡 Medium (1–2 weeks)

**4. i18n expansion — posts, pieces, galleries**
Currently i18n only applies to section titles and UI labels. Content data (post body, piece description, gallery description) is stored in a single language.
Options:
- **A) Per-field translation columns** — add `title_es`, `title_de`, `body_es` etc. to DB. Simple but verbose.
- **B) JSONB translations** — store `{ en: "...", es: "...", de: "..." }` per field. Flexible but requires editor UI changes.
- **C) Separate content rows with `locale` column** — clean but complex querying.
Recommended: Option B (JSONB). Requires: DB migration, editor UI with language tabs, public fetch filtered by locale.

**5. Reminder email to client before appointment**
After a booking is confirmed, schedule a reminder email N hours/days before `preferred_date`.
Requires: a scheduled job or cron (Vercel Cron / Supabase Edge Function with pg_cron).
Configurable timing in Studio settings (e.g. "24h before", "48h before").

**6. SaaS plan enforcement**
Enforce free/premium limits: gallery count, pieces per gallery, post count, custom domain.
`lib/tenants/plan.ts` foundation exists. Needs: limit checks in studio APIs, upgrade prompt in UI.

### 🔴 Hard (weeks)

**7. Calendar view for artist**
Month/week/agenda view of confirmed bookings.
Implementation: integrate a headless calendar lib (e.g. `react-big-calendar` or `@fullcalendar/react`).
Requires: bookings API to return date-indexed data, timezone handling.

**8. Google Calendar sync**
Sync confirmed bookings to artist's Google Calendar.
Requires: Google OAuth scope `calendar.events`, service account or per-user token, webhook on booking status change.
OAuth integration foundation exists but calendar scope not yet requested.

**9. WhatsApp notification to artist**
Push notification when a new booking arrives.
Requires: WhatsApp Business API account (Meta), webhook integration, per-artist phone number in profile.

**10. Multi-tenant platform admin**
Full SaaS governance: manage all tenants, plans, lifecycle, billing from `/admin`.
Foundation exists (`/api/admin/platform-tenants`). Needs: tenant list UI, plan assignment, suspension flow, usage metrics.

---

## Product Principles
- Every advanced integration should be optional.
- No misconfigured provider should break core portfolio, booking, or admin flows.
- Each integration should expose clear connection health and enable/disable controls.
- Post-MVP work should preserve the distinction between the public brand experience and the operational admin workspace.

## Theme 1 - SaaS Direction
- Multi-artist / multi-tenant architecture exploration.
- Tenant-aware branding, themes, and content boundaries.
- Role expansion beyond a single admin.
- Configurable feature modules per tenant.
- Platform admin controls to activate/deactivate artist pages.
- Auto-provision artist workspace on registration.
- Plan model with `free` and `premium` capabilities.
- Pilot rule: `akemi@tattoo.ink` mapped to premium baseline and custom brutalist theme.

## Theme 2 - Payments (Sandbox First)
- Stripe integration completed with sandbox validation.
- PayPal integration completed with sandbox validation.
- Test-token / sandbox operational checklist.
- Payment settings exposed in admin profile.
- Feature flags so payments can be enabled or disabled by the artist.

## Theme 3 - Calendar and Appointment Management
- Internal appointment calendar for the artist.
- Booking approval / rejection / reschedule workflow.
- Calendar views (month / week / agenda).
- Artist-configurable availability windows.
- Google Calendar sync for accepted appointments.
- Feature toggle so calendar sync can be enabled or disabled.
- Product naming candidate for menu: `Scheduling & Availability`.

## Theme 4 - Reminders and Notifications
- Reminder emails before appointments.
- Optional WhatsApp notification to the artist when a booking is created.
- Simultaneous email notification to the artist.
- Configurable reminder timing and notification preferences.
- Per-channel enable/disable controls in the admin profile.

## Theme 5 - Guided Support / Chatbot
- Chatbot for explaining site features and workflows to visitors/admins.
- Ticket creation path for developer/support escalation.
- Configurable handoff logic and escalation destinations.
- Feature toggle to enable or disable chatbot support.

## Theme 6 - Artist-Controlled Integrations
- Per-integration toggle model in admin settings.
- Visibility of connection health and delivery state.
- Safe degraded behavior if a provider is disconnected.
- Configurable defaults controlled by the artist.

## Expected External Dependencies Later
- Stripe keys.
- PayPal sandbox and production credentials.
- Google Calendar / Google Cloud credentials.
- WhatsApp delivery provider credentials.
- Reminder policy decisions.
- Chatbot scope and routing decisions.
- SaaS tenancy model decision.

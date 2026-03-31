# Post-MVP Backlog

Date: 2026-03-24
Status: Planned after MVP acceptance

## Goal
Capture the next evolution of the product after MVP is accepted, with a path toward a configurable SaaS platform for tattoo artists or adjacent creative studios.

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

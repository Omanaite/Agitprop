# Pending External Interventions

Date: 2026-03-24
Purpose: Track every item that requires user action, external credentials, or production access, without blocking autonomous development.

## Immediate MVP Verification
### Vercel
- Redeploy the latest `vercel` branch if production is behind.
- Confirm production is running the latest commit.
- Check Vercel runtime logs after smoke testing.

### Supabase
- Confirm latest `supabase/schema.sql` changes are applied in production.
- Apply `docs/sql/STUDIO_TENANT_OWNERSHIP_PATCH.sql` in production and preview to enable `owner_user_id` isolation for studio content endpoints.
- Apply `docs/sql/ARTIST_SITE_THEMES_PATCH.sql` in production and preview to enable tenant theme/domain fields and site-theme policy constraint.
- Confirm `homepage_sections` exists and policies are active.
- Confirm admin users still have `app_metadata.role = admin`.
- Confirm auth email templates and redirect URLs behave correctly in production.

### OAuth Providers
- Confirm Google OAuth credentials are active in Supabase.
- Confirm GitHub OAuth credentials are active in Supabase.
- Confirm production redirect URLs match the deployed domain.
- Test Google OAuth sign-in and sign-up in production.
- Test GitHub OAuth sign-in and sign-up in production.

### Email Delivery
- Confirm Resend production configuration if email sending is expected.
- Test booking notification email delivery.
- Test contact email delivery.
- Test registration confirmation email delivery.

## Editorial / Product Decisions
- Provide final brand-ready editorial copy where SEO-facing text still needs approval.
- Approve the final homepage/gallery SEO text.
- Confirm whether `/register` should remain non-indexed permanently.

## Deferred Until After MVP
These are intentionally blocked until MVP signoff so they do not destabilize the current product:
- Stripe sandbox validation.
- PayPal sandbox validation.
- Google Calendar credentials and sync rules.
- WhatsApp provider selection.
- Reminder cadence rules.
- Chatbot scope and escalation rules.
- SaaS tenancy decision.

## Working Rule
Items in this file should stay here until they are:
1. completed,
2. explicitly descoped, or
3. moved into an active implementation phase.

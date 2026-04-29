# MVP Status - Agitprop

Date: 2026-03-24
Status: Near-complete, pending production verification and external service confirmation

## MVP Definition
The MVP is considered complete when all of the following are true:
- Public site loads correctly in production.
- Public theme switching works (`light`, `eye`, `dark`).
- Public locale switching works (`en`, `es`, `de`).
- Public gallery browsing works, including gallery detail pages.
- Public posts are visible and stable.
- Booking form works end-to-end.
- Contact form works end-to-end.
- Admin login works with email/password.
- Admin login works with configured OAuth providers.
- Admin can manage galleries, pieces, posts, homepage composition, profile, and integrations.
- Registration works with email confirmation and OAuth sign-up.
- Production deploy is stable, with no blocking Vercel or Supabase issues.
- Baseline SEO and security hardening are in place.

## Already Done
- Admin CMS implemented.
- Public gallery and gallery detail pages implemented.
- Public posts feed implemented.
- Homepage composition from admin implemented.
- Public locale preference implemented.
- Theme switching implemented.
- Registration and OAuth sign-up implemented.
- Admin OAuth sign-in implemented.
- Baseline SEO implemented:
  - metadata
  - canonical baseline
  - robots
  - sitemap
  - JSON-LD
  - OG/Twitter images
- Public anti-abuse baseline implemented:
  - same-origin enforcement
  - rate limiting
  - honeypot fields
- Local quality gates currently pass:
  - `npm run lint`
  - `npm run build`
  - `npm audit`

## Remaining Before MVP Acceptance
### Needs production verification
- Confirm latest `vercel` commit is deployed.
- Run manual smoke test in production.
- Verify latest Supabase schema is fully applied in the target environment.
- Confirm homepage composition is no longer in fallback mode in production.
- Confirm OAuth provider flows in production.
- Confirm email flows with real environment configuration.

### Needs final QA / editorial closure
- Complete final visual QA sweep for admin typography and mobile UX.
- Replace any remaining low-trust editorial copy before final indexation.
- Decide whether `/register` remains permanently non-indexed.

## Rule
The MVP should only be marked complete after the production smoke test and environment-dependent checks are validated and recorded.

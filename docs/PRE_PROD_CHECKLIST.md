# Pre-Prod Checklist

Date: 2026-03-24
Status: In progress

## Goal
Provide a single operational checklist before declaring the product ready for production hardening and release review.

## Build and Deploy
- [x] `npm run build` passes locally.
- [x] `npm audit` reports `0 vulnerabilities` locally.
- [ ] Latest `vercel` commit deployed successfully in Vercel.
- [ ] No runtime 5xx errors in Vercel logs after smoke test.

## Supabase
- [ ] Latest `supabase/schema.sql` changes applied in the target project.
- [ ] `homepage_sections` table exists in production.
- [ ] Public and admin policies verified for `homepage_sections`.
- [ ] Admin user still has `app_metadata.role = admin`.

## Admin Smoke Test
- [ ] Admin login works with email/password.
- [ ] Admin login works with enabled OAuth providers.
- [ ] Profile save works.
- [ ] Integrations screen loads.
- [ ] Galleries CRUD works.
- [ ] Pieces CRUD works.
- [ ] Posts CRUD works.
- [ ] Homepage composition loads without fallback mode.
- [ ] Homepage composition saves and affects public home order.

## Public Smoke Test
- [ ] Home loads in `en`.
- [ ] Locale switch works for `en`, `es`, `de`.
- [ ] Theme switch works for `light`, `eye`, `dark`.
- [ ] Galleries list and gallery detail load.
- [ ] Public posts render.
- [ ] Booking form submit path works.
- [ ] Contact form submit path works.

## Quality Gates
- [ ] Manual security review completed against internal directives.
- [ ] Accessibility spot check completed for keyboard navigation and focus states.
- [ ] Copy review completed for English public UI and admin UI.
- [ ] Admin typography sweep completed after neutral font rollout.

## Notes
- Local dependency baseline updated to `next@16.2.1` and matching `eslint-config-next@16.2.1`.
- Homepage composition persistence still depends on applying the latest Supabase schema in production.

## Release Decision
- [ ] Product accepted for next production hardening step.

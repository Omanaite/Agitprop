# Pre-Prod Checklist

Date: 2026-03-24
Status: Awaiting production verification

## Goal
Provide a single operational checklist before declaring the current MVP ready for release signoff.

## Local Quality Gates
- [x] `npm run lint` passes locally.
- [x] `npm run build` passes locally.
- [x] `npm audit` reports `0 vulnerabilities` locally.

## Vercel
- [ ] Latest `vercel` commit deployed successfully.
- [ ] No runtime 5xx errors in Vercel logs after smoke test.
- [ ] Production is confirmed to be running the intended commit.

## Supabase
- [ ] Latest `supabase/schema.sql` changes applied in the target project.
- [ ] `homepage_sections` table exists in production.
- [ ] Public and admin policies verified for `homepage_sections`.
- [ ] Admin users still have `app_metadata.role = admin`.

## Admin Smoke Test
- [ ] Email/password admin login works.
- [ ] OAuth admin login works for enabled providers.
- [ ] Profile save works.
- [ ] Integrations screen loads.
- [ ] Galleries CRUD works.
- [ ] Pieces CRUD works.
- [ ] Posts CRUD works.
- [ ] Homepage composition loads without fallback mode.
- [ ] Homepage composition saves and affects public home order.

## Public Smoke Test
- [ ] Home loads in production.
- [ ] Locale switch works for `en`, `es`, `de`.
- [ ] Theme switch works for `light`, `eye`, `dark`.
- [ ] Galleries list and gallery detail load.
- [ ] Public posts render.
- [ ] Register flow works with email confirmation.
- [ ] Register flow works with Google/GitHub OAuth sign-up.
- [ ] Booking form submit path works.
- [ ] Contact form submit path works.

## Review Gates
- [ ] Manual security review completed against internal directives.
- [ ] Accessibility spot check completed for keyboard navigation and focus states.
- [ ] Copy review completed for public SEO-facing text.
- [ ] Admin typography sweep completed after neutral font rollout.

## Release Decision
- [ ] MVP accepted for the current single-artist product.

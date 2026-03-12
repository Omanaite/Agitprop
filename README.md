# Akemi Tattoo Manifesto

Brutalist portfolio webapp for a tattoo artist. Built with Next.js App Router, Supabase, Stripe, PayPal, and Resend.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template:
```bash
cp .env.example .env.local
```

3. Configure Supabase:
- Create a project in Supabase.
- Run `supabase/schema.sql` in the SQL editor.
- Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

4. Optional email + payments:
- Resend: add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`.
- Stripe: add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- PayPal: add `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`.

5. Start the dev server:
```bash
npm run dev
```

## Vercel Deployment

- Add the same env vars from `.env.example` in your Vercel project.
- Deploy the Next.js app.

## Notes

- The brutalist spec is applied in `app/globals.css` and all components.
- Payment flows are prepared; live credentials are needed to complete checkout.

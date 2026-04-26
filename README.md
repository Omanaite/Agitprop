# Agitprop Studio

Open-source platform for artists (especially tattoo artists) to run a professional website with portfolio, posts, contact form, and booking system, all managed from a private dashboard.

## Mission and vision

### Mission
Give independent artists a simple, professional, low-friction tool to showcase their work and manage their studio from one place.

### Vision
Build an open, collaborative creative platform where any artist can launch their digital presence, and where the community improves the product through contributions.

## What Agitprop Studio does (main features)

- Public artist websites with routes like `/{artist-slug}`.
- Galleries and piece detail pages (images, metadata, slug-based structure).
- Studio posts feed.
- Contact form.
- Booking/scheduling system with availability.
- Private artist dashboard (`/studio`) to manage:
- studio profile
- galleries and pieces
- posts
- availability and bookings
- integrations and payment settings
- Platform dashboard (`/admin`) for SaaS governance and tenant management.
- Visual theme system for public sites.
- Locale switching (`en`, `es`, `de`).
- Split view in Studio to edit and preview the live site side by side.
- SEO baseline: sitemap, robots, metadata, OpenGraph, and Twitter cards.
- Security baseline: role-based access, Supabase RLS, rate limiting, and anti-abuse protections.

## Suggested README images

- `[IMAGE HERE: Public artist homepage]`
- `[IMAGE HERE: Booking / scheduling system]`
- `[IMAGE HERE: Theme selector]`
- `[IMAGE HERE: Studio split view (editor + preview)]`
- `[IMAGE HERE: Admin control / platform console]`
- `[IMAGE HERE: Galleries and pieces management]`
- `[IMAGE HERE: Post management]`

## Use cases

1. An artist who needs a professional portfolio without coding.
2. A studio that wants to receive booking requests from its website.
3. A creator who wants to publish updates without relying only on social media.
4. A team that needs an open-source foundation to build an artist-focused SaaS.

## End-to-end example

1. An artist creates an account and enters `/studio`.
2. They complete their profile, choose a theme, and set up homepage sections.
3. They upload galleries and pieces.
4. They publish studio updates as posts.
5. They configure availability and pricing.
6. They share their public URL with clients.
7. Clients browse the portfolio and submit booking requests.
8. The artist reviews and manages requests from the private dashboard.

## Local installation (open source)

### Requirements

- Node.js 20+
- npm
- Supabase account

### Steps

1. Clone the repository.
2. Enter the project folder:

```bash
cd agitprop
```

3. Install dependencies:

```bash
npm install
```

4. Create `.env.local` with at least:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

5. Apply the database schema in Supabase:
- `supabase/schema.sql`

6. Start local development:

```bash
npm run dev
```

7. Open:
- `http://localhost:3000` (platform entry)
- `http://localhost:3000/studio/login` (artist dashboard)
- `http://localhost:3000/admin/login` (platform dashboard)

### Optional integrations

- Email (Resend): `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- PayPal: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`

## How to contribute (Pull Requests)

This project is open source. Anyone can propose code, UX, or feature improvements.

1. Fork the repository.
2. Create a branch:

```bash
git checkout -b feat/my-improvement
```

3. Make changes and run validations:

```bash
npm run lint
npm run test
```

4. Push your branch and open a Pull Request including:
- problem solved
- technical approach
- evidence (screenshots or tests)
- expected impact

5. PRs are reviewed with focus on quality, security, and maintainability.

## How it is built

### Technical stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling/UI: Tailwind CSS 4, Headless UI, Framer Motion
- Backend: Next.js Route Handlers
- Database and auth: Supabase (PostgreSQL, Auth, RLS, Storage)
- Payments: Stripe and PayPal (integration ready)
- Email: Resend
- Testing: Jest + Testing Library + Playwright
- Recommended deployment: Vercel

### Architecture approach

- Clear separation between:
- public experience (artist site)
- private experience (Studio and Admin)
- Role-based model for secure access and operations.
- Scoped private endpoints (`/api/studio/*` and `/api/admin/*`).
- Designed to evolve into a multi-tenant SaaS platform.

### Methodologies and quality

- Phase-based workflow with product/architecture docs (`docs/` and `openspec/`).
- Quality gates: planning, implementation, testing, security, and PR.
- Security is a mandatory merge requirement.
- Automated checks plus manual smoke tests for critical flows.

## Short roadmap

- Final MVP stabilization in production.
- Stronger QA, SEO, and security hardening.
- Gradual evolution of SaaS modules for multiple artists.

## License

Open-source project. Add the official repository license here (for example, MIT) when defined/updated.

import type { Metadata } from "next";
import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Agitprop | Artist website, portfolio & booking platform",
  description:
    "Agitprop helps artists launch a portfolio site, publish studio updates, and manage client bookings from one workspace. Free to start.",
  openGraph: {
    title: "Agitprop — Artist website, portfolio & booking platform",
    description:
      "Launch your artist site in minutes. Portfolio galleries, publishing, and client bookings — all from one control room.",
    type: "website",
  },
};

export const revalidate = 3600; // Revalidar cada hora para actualizar el slug de la demo

const features = [
  {
    tag: "portfolio",
    title: "Galleries",
    body: "Curate work into collections. Each gallery gets its own page, slug, and cover image.",
  },
  {
    tag: "content",
    title: "Studio publishing",
    body: "Aftercare, policies, and studio news. Draft, schedule, or publish on your timing.",
  },
  {
    tag: "bookings",
    title: "Client intake",
    body: "Capture session requests with placement, style, and budget. Reply on your terms.",
  },
  {
    tag: "identity",
    title: "Your URL",
    body: "Live at agitpropstudio.vercel.app/you. Connect a custom domain when ready.",
  },
  {
    tag: "themes",
    title: "Visual themes",
    body: "Six built-in styles — Atelier, Mono, Ink, Verdure, Amber. Each opinionated, fast, and clean.",
  },
  {
    tag: "platform",
    title: "Secure by default",
    body: "OAuth, email confirmation, rate limiting, tenant isolation. Out of the box.",
  },
];

const freeFeatures = [
  "2 galleries · 25 pieces · 5 posts",
  "Booking intake from clients",
  "All visual themes included",
  "Telegram notifications",
  "Light / Dark mode per theme",
  "EN / ES / DE language toggle",
  "agitpropstudio.vercel.app/you URL",
];

const expandedFeatures = [
  "Everything in the free tier",
  "Unlimited galleries, pieces, posts",
  "Custom domain via Vercel (no markup)",
];

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up with email or OAuth. No credit card required.",
  },
  {
    n: "02",
    title: "Set your page name",
    body: "Choose your studio URL, pick a visual theme, and fill out your profile.",
  },
  {
    n: "03",
    title: "Add your work",
    body: "Create galleries, upload pieces, write your first post. Your site is live.",
  },
];

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-[3px] h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default async function AgitpropPage() {
  // Obtenemos el slug de Akemi dinámicamente desde Supabase usando su owner_user_id fijo.
  // ID asociado a akemi@tattoo.ink en STATE.md: 030ae67c-d882-4cfe-a6ae-d006fe6bf2ce
  const supabase = createSupabaseServerClient();
  const { data: akemiTenant } = await supabase
    .from("artist_tenants")
    .select("slug")
    .eq("owner_user_id", "030ae67c-d882-4cfe-a6ae-d006fe6bf2ce")
    .single();

  const akemiSlug = akemiTenant?.slug || "akemion-tattoo";

  return (
    <div className="marketing-shell min-h-screen overflow-x-hidden">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[color-mix(in_srgb,var(--mkt-bg)_85%,transparent)] border-b border-[var(--mkt-border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/agitprop" className="mkt-display text-lg font-semibold tracking-tight">
            Agitprop
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">Features</a>
            <a href="#pricing" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/studio/login" className="hidden text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors sm:inline">
              Sign in
            </Link>
            <Link href="/register" className="mkt-button mkt-button-primary !py-2 !px-4 !text-xs">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero — editorial asymmetric */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Top strip: masthead + status */}
          <div className="flex items-center gap-4 mb-12 md:mb-20">
            <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted shrink-0">
              Agitprop / Vol.01 / Est. 2026
            </p>
            <div className="flex-1 h-px bg-[var(--mkt-border)]" />
            <div className="mkt-chip shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mkt-success)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mkt-success)]" />
              </span>
              <span className="hidden sm:inline">Free forever — no credit card</span>
              <span className="sm:hidden">Free forever</span>
            </div>
          </div>

          {/* Asymmetric main: 7 / 5 split */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            {/* Left: massive display heading */}
            <h1 className="col-span-12 lg:col-span-7 mkt-display text-6xl sm:text-7xl lg:text-[7rem] leading-[0.88] tracking-[-0.04em]">
              Artist
              <br />
              websites,
              <br />
              <span className="mkt-muted">galleries</span>
              <br />
              &amp; bookings.
            </h1>

            {/* Right: numbered manifesto */}
            <div className="col-span-12 lg:col-span-5 lg:pt-4">
              <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted mb-6">
                The pitch — in three points
              </p>
              <ol className="space-y-5">
                {[
                  { n: "01", title: "No subscriptions, ever.", body: "Free for the basics, forever. Pay once for more space, or don't." },
                  { n: "02", title: "No infrastructure work.", body: "Sign up, pick a name, you're live. Database, auth, domains — handled." },
                  { n: "03", title: "Built for artists, not devs.", body: "Six visual themes. Three languages. One workspace for galleries, posts, bookings." },
                ].map((item) => (
                  <li key={item.n} className="grid grid-cols-[2.25rem_1fr] gap-3 items-start">
                    <span className="mkt-mono text-xs mkt-muted pt-1">{item.n}</span>
                    <div>
                      <p className="text-sm font-semibold leading-snug">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed mkt-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Bottom strip: CTAs + tags, anchored left */}
          <div className="mt-16 md:mt-24 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/register" className="mkt-button mkt-button-primary group transition-transform active:scale-[0.98] duration-200">
                Start your site — free <ArrowRight />
              </Link>
              <Link href="/studio/login" className="mkt-button transition-transform active:scale-[0.98] duration-200">
                Sign in
              </Link>
              <Link href={`/${akemiSlug}`} className="mkt-button transition-transform active:scale-[0.98] duration-200 border-[var(--mkt-border-strong)] text-[var(--mkt-muted)]">
                Demo (Prototype)
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted mr-2">
                For
              </span>
              <span className="mkt-tag">Tattoo</span>
              <span className="mkt-tag">Illustration</span>
              <span className="mkt-tag">Photography</span>
              <span className="mkt-tag">Design</span>
            </div>
          </div>
        </section>

        {/* Theme marquee divider */}
        <div className="overflow-hidden border-y border-[var(--mkt-border)] py-4 -mx-6 mb-2">
          <div className="flex gap-10 mkt-mono text-xs uppercase tracking-[0.18em] mkt-muted whitespace-nowrap animate-[marquee_28s_linear_infinite]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-10 shrink-0">
                <span>Atelier</span>
                <span aria-hidden="true">·</span>
                <span>Mono</span>
                <span aria-hidden="true">·</span>
                <span>Ink</span>
                <span aria-hidden="true">·</span>
                <span>Verdure</span>
                <span aria-hidden="true">·</span>
                <span>Amber</span>
                <span aria-hidden="true">·</span>
                <span>Brutalist</span>
                <span aria-hidden="true">·</span>
                <span className="text-[var(--mkt-fg)] font-semibold">Six themes included</span>
                <span aria-hidden="true">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mkt-divider py-24 md:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="mkt-mono text-xs uppercase tracking-[0.2em] mkt-muted">What you get</p>
            <h2 className="mkt-display mt-3 text-3xl sm:text-4xl">
              Everything an artist needs.
              <span className="mkt-muted"> Nothing they don&apos;t.</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="mkt-card mkt-card-hover p-6">
                <span className="mkt-tag">{f.tag}</span>
                <h3 className="mkt-display mt-5 text-xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 mkt-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mkt-divider py-24 md:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="mkt-mono text-xs uppercase tracking-[0.2em] mkt-muted">Pricing</p>
            <h2 className="mkt-display mt-3 text-3xl sm:text-4xl">
              Free, with one honest upgrade.
            </h2>
            <p className="mt-4 text-base leading-relaxed mkt-muted">
              No tiers. No subscriptions. Just expand your storage when you need to.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Free — emphasized */}
            <article className="relative mkt-card p-7 md:p-8 flex flex-col" style={{ borderColor: "var(--mkt-border-strong)" }}>
              <div className="absolute right-7 top-7 mkt-tag">recommended</div>
              <p className="mkt-mono text-xs uppercase tracking-[0.18em] mkt-muted">Always free</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="mkt-display text-5xl">€0</span>
                <span className="text-sm mkt-muted">/ forever</span>
              </div>
              <p className="mt-2 text-sm leading-6 mkt-muted">
                No credit card. No trial. No catch.
              </p>
              <ul className="mt-7 space-y-3 flex-1">
                {freeFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register" className="mkt-button mkt-button-primary w-full group">
                  Create your site <ArrowRight />
                </Link>
              </div>
            </article>

            {/* Expanded */}
            <article className="mkt-card p-7 md:p-8 flex flex-col">
              <p className="mkt-mono text-xs uppercase tracking-[0.18em] mkt-muted">More space</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="mkt-display text-5xl">One-time</span>
              </div>
              <p className="mt-2 text-sm leading-6 mkt-muted">
                Hit the free limit? Expand once. We set a fair price for how much extra you need.
              </p>
              <ul className="mt-7 space-y-3 flex-1">
                {expandedFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register" className="mkt-button w-full">Start free</Link>
              </div>
            </article>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mkt-mono text-xs uppercase tracking-[0.18em] mkt-muted">Custom domain</p>
              <p className="mt-2 text-sm leading-6 mkt-muted">
                Buy through Vercel at their listed price — no markup. The domain auto-connects to your site.
              </p>
            </div>
            <div>
              <p className="mkt-mono text-xs uppercase tracking-[0.18em] mkt-muted">Existing domain elsewhere?</p>
              <p className="mt-2 text-sm leading-6 mkt-muted">
                If your domain lives at GoDaddy, Namecheap, etc., reach out at{" "}
                <a href="mailto:chandiapablo@outlook.com" className="text-[var(--mkt-fg)] underline underline-offset-4 decoration-[var(--mkt-border-strong)] hover:decoration-[var(--mkt-fg)] transition-colors">
                  chandiapablo@outlook.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mkt-divider py-24 md:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="mkt-mono text-xs uppercase tracking-[0.2em] mkt-muted">Getting started</p>
            <h2 className="mkt-display mt-3 text-3xl sm:text-4xl">
              Up and running in minutes.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="mkt-card p-7">
                <span className="mkt-display text-3xl mkt-muted opacity-50 tabular-nums">{s.n}</span>
                <h3 className="mkt-display mt-6 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 mkt-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Big CTA */}
        <section className="mkt-divider py-24 md:py-28">
          <div className="mkt-card p-10 md:p-16 text-center">
            <h2 className="mkt-display text-3xl sm:text-5xl max-w-3xl mx-auto">
              Ready to publish your work the way it deserves?
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-base leading-relaxed mkt-muted">
              Free, no credit card, no trial. Your portfolio can be live in the next few minutes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="mkt-button mkt-button-primary group">
                Get started — it&apos;s free <ArrowRight />
              </Link>
              <Link href="/studio/login" className="mkt-button">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mkt-divider py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="mkt-display text-base font-semibold">Agitprop</span>
              <span className="text-xs mkt-muted">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-xs mkt-muted">
              <a href="/legal/impressum" className="hover:text-[var(--mkt-fg)] transition-colors">Impressum</a>
              <a href="/legal/agb" className="hover:text-[var(--mkt-fg)] transition-colors">AGB</a>
              <a href="/legal/datenschutz" className="hover:text-[var(--mkt-fg)] transition-colors">Datenschutz</a>
              <a
                href="mailto:chandiapablo@outlook.com"
                className="hover:text-[var(--mkt-fg)] transition-colors"
              >
                chandiapablo@outlook.com
              </a>
              <AdminThemeToggle />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

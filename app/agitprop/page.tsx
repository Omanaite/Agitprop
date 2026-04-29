import type { Metadata } from "next";
import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

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

const features = [
  {
    title: "Portfolio galleries",
    body: "Organize your work into curated collections. Each gallery gets its own page, slug, and visual style — ready for clients to browse.",
  },
  {
    title: "Studio publishing",
    body: "Write posts for aftercare, policies, and studio news. Draft privately, schedule ahead, or publish immediately.",
  },
  {
    title: "Client booking intake",
    body: "Capture session requests with placement, style, and budget details. Respond on your timeline — no missed DMs.",
  },
  {
    title: "Your own URL",
    body: "Go live at agitpropstudio.vercel.app/you. Connect your own domain when you're ready.",
  },
  {
    title: "Visual themes",
    body: "Six built-in styles — Atelier, Mono, Ink, Verdure, Amber, and more. Each is clean, fast, and built for creative portfolios.",
  },
  {
    title: "Secure by default",
    body: "OAuth sign-in, email confirmation, rate limiting, and tenant isolation out of the box.",
  },
];

const freeFeatures = [
  "2 galleries, 25 pieces, 5 posts",
  "Booking intake from clients",
  "All visual themes included",
  "Telegram notifications for bookings",
  "Light / Dark mode per theme",
  "EN / ES / DE language toggle",
  "agitpropstudio.vercel.app/you URL",
];

const expandedFeatures = [
  "Everything in the free tier",
  "Unlimited galleries, pieces, and posts",
  "Custom domain (purchased via Vercel — you pay Vercel's price directly)",
];

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-accent)]"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AgitpropPage() {
  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>

        {/* Hero — left-aligned, no centered cliché */}
        <section className="admin-card p-6 md:p-12 lg:p-16">
          <p className="admin-chip mb-6">Agitprop Studio Platform</p>
          <h1 className="admin-title text-5xl font-black tracking-tight leading-[1.02] md:text-6xl lg:text-7xl">
            Your artist website,
            <br />portfolio, and
            <br />booking system.
          </h1>
          <p className="admin-muted mt-6 max-w-xl text-base leading-7">
            One workspace to showcase galleries,
            publish studio updates, and capture client requests.
            No infrastructure, no subscriptions.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/register" className="admin-button admin-button-primary">
              Get started — it&apos;s free
            </Link>
            <Link href="/studio/login" className="admin-button admin-button-ghost">
              Sign in
            </Link>
          </div>
        </section>

        {/* Features — border list, not card grid */}
        <section className="mt-6 admin-card overflow-hidden">
          <div className="px-6 pt-6 pb-2 md:px-8 md:pt-8">
            <p className="admin-chip">What you get</p>
          </div>
          <div className="divide-y divide-[var(--admin-border)]">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="grid grid-cols-1 gap-1 px-6 py-5 md:grid-cols-[1fr_2fr] md:gap-8 md:px-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] font-mono text-[var(--admin-muted)] w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="admin-title text-sm font-semibold">{f.title}</h2>
                </div>
                <p className="admin-muted text-sm leading-6 md:pl-0">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Free */}
          <article className="admin-card p-6 md:p-8 flex flex-col">
            <p className="admin-chip">Always free</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="admin-title text-4xl font-black tracking-tight">€0</span>
              <span className="admin-muted text-sm">/ forever</span>
            </div>
            <p className="admin-muted mt-2 text-sm leading-6">
              No credit card. No trial. No catch.
            </p>
            <ul className="mt-6 space-y-2.5 flex-1">
              {freeFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckIcon />
                  <span className="text-[var(--admin-title)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/register"
                className="admin-button admin-button-primary w-full justify-center"
              >
                Create your site
              </Link>
            </div>
          </article>

          {/* Expanded */}
          <article className="admin-card p-6 md:p-8 flex flex-col">
            <p className="admin-chip">More space</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="admin-title text-4xl font-black tracking-tight">One-time</span>
            </div>
            <p className="admin-muted mt-2 text-sm leading-6">
              Hit the free limit? Expand your storage once — no subscriptions.
              We set a fair price based on how much extra space you need.
            </p>
            <ul className="mt-6 space-y-2.5 flex-1">
              {expandedFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckIcon />
                  <span className="text-[var(--admin-title)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/register" className="admin-button w-full justify-center">
                Start free
              </Link>
            </div>
          </article>
        </section>

        {/* Domain & storage explainer */}
        <section className="admin-card mt-6 p-6 md:p-8">
          <p className="admin-chip">Details</p>
          <h2 className="admin-title mt-4 text-2xl font-bold tracking-tight">Storage &amp; custom domains</h2>
          <div className="mt-6 divide-y divide-[var(--admin-border)]">
            {[
              {
                title: "Free storage limit",
                body: (
                  <>
                    Every account starts with 2 galleries, 25 pieces, and 5 posts.
                    When you reach the limit, delete older content to make room — or contact us
                    to expand your storage. We&apos;ll set a fair one-time cost based on how much extra
                    space you need.
                  </>
                ),
              },
              {
                title: "Custom domain via Vercel",
                body: (
                  <>
                    Your site runs on Vercel. If you want a custom domain (e.g.{" "}
                    <span className="font-mono text-xs">yourname.com</span>),
                    buy it directly through Vercel at their listed price — we don&apos;t mark it up.
                    The domain gets connected automatically.
                  </>
                ),
              },
              {
                title: "Domain from another registrar?",
                body: (
                  <>
                    If you own a domain with GoDaddy, Namecheap, or any other registrar,
                    connecting it requires a custom agreement with the developer. Reach out
                    at{" "}
                    <a href="mailto:chandiapablo@outlook.com" className="underline opacity-70 hover:opacity-100 transition-opacity">
                      chandiapablo@outlook.com
                    </a>
                    .
                  </>
                ),
              },
              {
                title: "Why Vercel?",
                body: (
                  <>
                    Agitprop is hosted on Vercel. Their domain API integrates directly with
                    the platform — when you add a domain in your studio, it&apos;s registered
                    and routed automatically. No manual DNS on our end.
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="grid grid-cols-1 gap-1 py-5 md:grid-cols-[1fr_2fr] md:gap-8 first:pt-0">
                <h3 className="admin-title text-sm font-semibold">{item.title}</h3>
                <p className="admin-muted text-sm leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="admin-card mt-6 p-6 md:p-8">
          <p className="admin-chip">Getting started</p>
          <h2 className="admin-title mt-4 text-2xl font-bold tracking-tight">
            Up and running in minutes
          </h2>
          <div className="mt-8 grid gap-0 divide-y divide-[var(--admin-border)]">
            {[
              {
                step: "01",
                title: "Create your account",
                body: "Sign up with email or OAuth. No credit card required.",
              },
              {
                step: "02",
                title: "Set your page name",
                body: "Choose your studio URL, pick a visual theme, and fill out your profile.",
              },
              {
                step: "03",
                title: "Add your work",
                body: "Create galleries, upload portfolio pieces, and write your first post. Your site is live.",
              },
            ].map((s) => (
              <div key={s.step} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="text-3xl font-black text-[var(--admin-accent)] leading-none opacity-30 tabular-nums">
                  {s.step}
                </span>
                <div>
                  <h3 className="admin-title text-sm font-semibold">{s.title}</h3>
                  <p className="admin-muted mt-1 text-sm leading-6">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 border-t border-[var(--admin-border)] pt-6">
            <Link href="/register" className="admin-button admin-button-primary">
              Get started — it&apos;s free
            </Link>
            <Link href="/studio/login" className="admin-button admin-button-ghost">
              Sign in
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[var(--admin-border)] pt-6 pb-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--admin-muted)]">
              © {new Date().getFullYear()} Agitprop Studio. Built by{" "}
              <a
                href="mailto:chandiapablo@outlook.com"
                className="underline underline-offset-2 hover:text-[var(--admin-title)] transition-colors"
              >
                Pablo Chandía
              </a>
              .
            </p>
            <div className="flex gap-5 text-xs text-[var(--admin-muted)]">
              <a href="/legal/impressum" className="hover:text-[var(--admin-title)] transition-colors">Impressum</a>
              <a href="/legal/agb" className="hover:text-[var(--admin-title)] transition-colors">AGB</a>
              <a href="/legal/datenschutz" className="hover:text-[var(--admin-title)] transition-colors">Datenschutz</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

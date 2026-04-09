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
    body: "Choose your page name and go live at agitpropstudio.vercel.app/you. Connect your own domain when you're ready.",
  },
  {
    title: "Visual themes",
    body: "Pick from three built-in styles — Atelier, Mono, and Ink. Each theme is clean, fast, and built for creative portfolios.",
  },
  {
    title: "Secure by default",
    body: "OAuth sign-in with Google and GitHub, email confirmation, rate limiting, and tenant isolation out of the box.",
  },
];

const freeFeatures = [
  "2 galleries, 25 pieces, 5 posts",
  "Booking intake from clients",
  "All 5 visual themes included",
  "Telegram notifications for bookings",
  "Light / Eye / Dark mode",
  "EN / ES / DE language toggle",
  "agitpropstudio.vercel.app/you URL",
];

const expandedFeatures = [
  "Everything in the free tier",
  "Unlimited galleries, pieces, and posts",
  "Custom domain support",
  "When your free storage fills up, manage your content by removing old pieces to make room — or keep everything and expand your storage.",
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

        {/* Hero */}
        <section className="admin-card p-6 md:p-10">
          <p className="admin-chip">Agitprop Studio Platform</p>
          <h1 className="admin-title mt-5 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Your artist website,
            <br className="hidden sm:block" /> portfolio, and booking system.
          </h1>
          <p className="admin-muted mt-5 max-w-2xl text-base leading-7">
            Agitprop gives artists a production-ready web presence without
            building infrastructure from scratch. One workspace to showcase galleries,
            publish studio updates, and capture client requests.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="admin-button admin-button-primary">
              Get started free
            </Link>
            <Link href="/studio/login" className="admin-button admin-button-ghost">
              I already have an account
            </Link>
          </div>
        </section>

        {/* Features grid */}
        <section className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="admin-card p-5">
                <h2 className="admin-title text-base font-semibold">{f.title}</h2>
                <p className="admin-muted mt-2 text-sm leading-6">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="admin-card p-6 md:p-7">
            <p className="admin-chip">Always free</p>
            <h3 className="admin-title mt-4 text-2xl font-semibold">Free</h3>
            <p className="admin-muted mt-1 text-sm leading-6">
              Everything you need to have a professional online presence. No credit card, no trial.
            </p>
            <ul className="mt-5 space-y-2.5">
              {freeFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckIcon />
                  <span className="text-[var(--admin-title)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Link
                href="/register"
                className="admin-button admin-button-primary w-full justify-center"
              >
                Create your site — free
              </Link>
            </div>
          </article>

          <article className="admin-card p-6 md:p-7">
            <p className="admin-chip">More storage</p>
            <h3 className="admin-title mt-4 text-2xl font-semibold">Expanded Storage</h3>
            <p className="admin-muted mt-1 text-sm leading-6">
              When your free storage fills up, you can expand it. No subscriptions — you decide when and how much.
            </p>
            <ul className="mt-5 space-y-2.5">
              {expandedFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckIcon />
                  <span className="text-[var(--admin-title)]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Link
                href="/register"
                className="admin-button w-full justify-center"
              >
                Start free
              </Link>
            </div>
          </article>
        </section>

        {/* How it works */}
        <section className="admin-card mt-6 p-6 md:p-8">
          <p className="admin-chip">How it works</p>
          <h2 className="admin-title mt-4 text-2xl font-semibold">
            Up and running in minutes
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
              <div key={s.step} className="admin-card-soft p-5">
                <span className="text-3xl font-bold text-[var(--admin-accent)] opacity-40">
                  {s.step}
                </span>
                <h3 className="admin-title mt-3 text-base font-semibold">{s.title}</h3>
                <p className="admin-muted mt-2 text-sm leading-6">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="admin-button admin-button-primary">
              Get started free
            </Link>
            <Link href="/studio/login" className="admin-button admin-button-ghost">
              I already have an account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[var(--admin-border)] pt-6 pb-2 text-center text-xs text-[var(--admin-muted)]">
          © {new Date().getFullYear()} Agitprop Studio. All rights reserved. Built by{" "}
          <a
            href="https://agitpropstudio.vercel.app/admin/login"
            className="underline underline-offset-2 hover:text-[var(--admin-title)] transition-colors"
          >
            Pablo Chandía
          </a>
          .
          <div className="mt-3 flex justify-center gap-6 text-xs uppercase tracking-widest border-t border-[var(--admin-border)] pt-3">
            <a href="/legal/impressum" className="hover:underline">Impressum</a>
            <a href="/legal/agb" className="hover:underline">AGB</a>
            <a href="/legal/datenschutz" className="hover:underline">Datenschutz</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

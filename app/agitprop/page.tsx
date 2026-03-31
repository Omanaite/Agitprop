import type { Metadata } from "next";
import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export const metadata: Metadata = {
  title: "Agitprop | Build your artist website and booking system",
  description:
    "Agitprop helps tattoo artists launch a portfolio site, publish updates, and manage bookings from one admin console.",
};

export default function AgitpropPage() {
  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>
        <section className="admin-card p-6 md:p-8">
          <p className="admin-chip">Agitprop</p>
          <h1 className="admin-title mt-5 text-4xl font-semibold md:text-5xl">
            Launch your artist website, portfolio, and booking flow.
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Agitprop is a platform for tattoo artists who want a production-ready
            web presence without building infrastructure from scratch.
            Showcase galleries, publish updates, and manage client requests from
            one control room.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="admin-card-soft p-4">
              <h2 className="text-lg font-semibold text-[var(--admin-title)]">
                Portfolio
              </h2>
              <p className="admin-muted mt-2 text-sm leading-6">
                Curated galleries, visual storytelling, and client-facing
                presentation designed for conversion.
              </p>
            </article>
            <article className="admin-card-soft p-4">
              <h2 className="text-lg font-semibold text-[var(--admin-title)]">
                Publishing
              </h2>
              <p className="admin-muted mt-2 text-sm leading-6">
                Create posts for aftercare, policies, and studio updates with
                draft and publish workflows.
              </p>
            </article>
            <article className="admin-card-soft p-4">
              <h2 className="text-lg font-semibold text-[var(--admin-title)]">
                Booking
              </h2>
              <p className="admin-muted mt-2 text-sm leading-6">
                Capture client requests and evolve toward full scheduling and
                availability management.
              </p>
            </article>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="admin-card-soft p-4">
              <p className="admin-chip">Free</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--admin-title)]">
                Starter
              </h3>
              <ul className="admin-muted mt-3 space-y-2 text-sm leading-6">
                <li>Portfolio and posting basics</li>
                <li>Core booking intake</li>
                <li>Three default visual styles</li>
              </ul>
            </article>
            <article className="admin-card-soft p-4">
              <p className="admin-chip">Premium</p>
              <h3 className="mt-3 text-xl font-semibold text-[var(--admin-title)]">
                Studio Pro
              </h3>
              <ul className="admin-muted mt-3 space-y-2 text-sm leading-6">
                <li>Full feature set and integrations</li>
                <li>Advanced scheduling and automation</li>
                <li>Custom style and brand controls</li>
              </ul>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="admin-button admin-button-primary">
              Create account
            </Link>
            <Link href="/admin/login" className="admin-button">
              Admin login
            </Link>
            <Link href="/" className="admin-button admin-button-ghost">
              View pilot site
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";

export function StudioWorkspaceShell() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="admin-card p-6">
        <p className="admin-chip">Workspace</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">
          Artist workspace ready
        </h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          Your login and tenant bootstrap are working. We are now completing the
          migration to artist-scoped APIs so content modules run without platform
          admin permissions.
        </p>
      </section>

      <section className="admin-card p-6">
        <p className="admin-chip">Next modules</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">
          Coming next
        </h2>
        <ul className="admin-muted mt-3 space-y-2 text-sm leading-6">
          <li>Artist profile and payment settings (`/api/studio/profile`)</li>
          <li>Artist galleries and pieces (`/api/studio/gallery*`)</li>
          <li>Artist posts and homepage composition (`/api/studio/posts`, `/api/studio/homepage-sections`)</li>
          <li>Artist integrations policy linked to platform switches</li>
        </ul>
      </section>

      <section className="admin-card p-6 md:col-span-2">
        <p className="admin-chip">Access</p>
        <h2 className="admin-title mt-4 text-2xl font-semibold">
          What you can do now
        </h2>
        <p className="admin-muted mt-3 text-sm leading-6">
          You can stay in this workspace as artist user. Platform administration
          is intentionally separated and available only at `/admin`.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/agitprop" className="admin-button admin-button-primary">
            Product page
          </Link>
          <Link href="/" className="admin-button admin-button-ghost">
            Pilot public site
          </Link>
        </div>
      </section>
    </div>
  );
}


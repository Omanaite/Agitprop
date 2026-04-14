import type { Metadata } from "next";
import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { OAuthTermsGate } from "@/components/auth/OAuthTermsGate";

export const metadata: Metadata = {
  title: "Account Ready | Agitprop",
  description: "Registration completion and confirmation state for Agitprop accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

type CompletePageProps = {
  searchParams?: { source?: string };
};

function getContent(source?: string) {
  if (source?.startsWith("oauth")) {
    return {
      chip: "Account ready",
      title: "You're in.",
      body: "Your account is connected via OAuth. Head to your studio workspace to set up your portfolio, choose a theme, and pick your page name.",
      primaryLabel: "Open studio workspace",
      primaryHref: "/studio",
      secondaryLabel: "Go to homepage",
      secondaryHref: "/agitprop",
    };
  }

  return {
    chip: "Account ready",
    title: "You're confirmed.",
    body: "Your account is active. Open your studio workspace to start building your artist site — add galleries, upload work, and go live.",
    primaryLabel: "Open studio workspace",
    primaryHref: "/studio",
    secondaryLabel: "Go to homepage",
    secondaryHref: "/agitprop",
  };
}

const nextSteps = [
  { label: "Set your page name", detail: "Profile → Page name section" },
  { label: "Pick a visual theme", detail: "Site → Appearance tab" },
  { label: "Create your first gallery", detail: "Galleries → Create" },
  { label: "Upload portfolio pieces", detail: "Pieces → Library" },
];

export default function RegisterCompletePage({ searchParams }: CompletePageProps) {
  const source = searchParams?.source;
  const content = getContent(source);

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>
        <section className="admin-card p-6 md:p-8">
          <p className="admin-chip">{content.chip}</p>
          <h1 className="admin-title mt-5 text-3xl font-semibold md:text-4xl">
            {content.title}
          </h1>
          <p className="admin-muted mt-4 text-sm leading-7">{content.body}</p>

          {source?.startsWith("oauth") ? (
            <OAuthTermsGate
              primaryHref={content.primaryHref}
              primaryLabel={content.primaryLabel}
              secondaryHref={content.secondaryHref}
              secondaryLabel={content.secondaryLabel}
            />
          ) : (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={content.primaryHref} className="admin-button admin-button-primary">
                {content.primaryLabel}
              </Link>
              <Link href={content.secondaryHref} className="admin-button admin-button-ghost">
                {content.secondaryLabel}
              </Link>
            </div>
          )}
        </section>

        <section className="admin-card mt-4 p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--admin-muted)]">
            Suggested next steps
          </p>
          <ul className="mt-4 space-y-3">
            {nextSteps.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--admin-accent-soft)] text-xs font-bold text-[var(--admin-accent)]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--admin-title)]">{s.label}</p>
                  <p className="admin-muted text-xs leading-5">{s.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

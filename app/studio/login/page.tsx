import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { signInAdmin } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "Artist Login | Agitprop",
  description: "Secure artist workspace login for Agitprop.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams?: { error?: string; reason?: string };
};

function getErrorMessage(code?: string, reason?: string) {
  switch (code) {
    case "missing":
      return "Enter email and password.";
    case "invalid":
      return "Invalid credentials.";
    case "forbidden":
      return "Account does not have access to this workspace.";
    case "config":
      return "Configure Supabase in Vercel before signing in.";
    case "server":
      return `Server error. ${reason ? `Detail: ${reason}` : ""}`.trim();
    case "unconfirmed":
      return "Confirm your email in Supabase before signing in.";
    case "rate":
      return "Too many attempts. Please try again later.";
    default:
      return "";
  }
}

export default function StudioLoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(searchParams?.error, searchParams?.reason);

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <section className="admin-card hidden p-8 lg:block">
            <p className="admin-chip">Artist workspace</p>
            <h1 className="admin-title mt-6 text-5xl font-semibold leading-tight">
              Sign in to manage your studio site.
            </h1>
            <p className="admin-muted mt-5 max-w-xl text-base leading-7">
              Access your galleries, posts, homepage sections, and operational
              settings from the workspace built for artists.
            </p>
          </section>

          <section className="admin-card p-6 md:p-8">
            <p className="admin-chip">Artist access</p>
            <h1 className="admin-title mt-5 text-3xl font-semibold">
              Sign in to your workspace
            </h1>
            <p className="admin-muted mt-3 text-sm leading-6">
              Use email and password to continue.
            </p>

            {errorMessage ? (
              <p className="admin-validation mt-5" data-variant="error" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}

            {searchParams?.error === "unconfirmed" ? (
              <ResendConfirmationForm />
            ) : null}

            <div className="mt-6">
              <AdminLoginForm action={signInAdmin} />
            </div>

            <div className="admin-divider my-6" />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--admin-muted)]">
                OAuth sign in
              </p>
              <div className="flex flex-wrap gap-3">
                <OAuthProviderButton
                  provider="google"
                  href="/api/auth/oauth?provider=google&next=/studio"
                  label="Continue with Google"
                />
                <OAuthProviderButton
                  provider="github"
                  href="/api/auth/oauth?provider=github&next=/studio"
                  label="Continue with GitHub"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

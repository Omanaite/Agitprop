import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { signInAdmin } from "./actions";

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
      return "Account does not have admin access.";
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

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(
    searchParams?.error,
    searchParams?.reason
  );

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <section className="admin-card hidden p-8 lg:block">
            <p className="admin-chip">Admin workspace</p>
            <h1 className="admin-title mt-6 text-5xl font-semibold leading-tight">
              Calm control for the studio side of the product.
            </h1>
            <p className="admin-muted mt-5 max-w-xl text-base leading-7">
              The admin experience now lives as its own operational surface:
              softer layout, clearer hierarchy, progressive loading, and a
              focused content workflow separate from the public portfolio.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  Separate visual system
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  The panel uses its own navigation and interaction language.
                </p>
              </div>
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  Theme aware
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  Normal, eye, and dark modes stay available inside admin.
                </p>
              </div>
            </div>
          </section>

          <section className="admin-card p-6 md:p-8">
            <p className="admin-chip">Admin access</p>
            <h1 className="admin-title mt-5 text-3xl font-semibold">
              Sign in to the control room
            </h1>
            <p className="admin-muted mt-3 text-sm leading-6">
              Use email and password or continue with an approved OAuth provider.
            </p>

            {errorMessage ? (
              <p
                className="admin-validation mt-5"
                data-variant="error"
                aria-live="polite"
              >
                {errorMessage}
              </p>
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
                  href="/api/admin/integrations/oauth?provider=google"
                  label="Continue with Google"
                />
                <OAuthProviderButton
                  provider="github"
                  href="/api/admin/integrations/oauth?provider=github"
                  label="Continue with GitHub"
                />
              </div>
            </div>

            <p className="admin-muted mt-6 text-sm leading-6">
              Need a standard account first?{" "}
              <a
                href="/register"
                className="font-semibold text-[var(--admin-accent)]"
              >
                Create one here
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

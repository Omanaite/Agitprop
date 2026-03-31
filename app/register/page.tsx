import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { signUpUser } from "./actions";

export const metadata: Metadata = {
  title: "Create Account | Agitprop",
  description:
    "Create a standard Agitprop account with email confirmation or OAuth sign-up.",
  robots: {
    index: false,
    follow: false,
  },
};

type RegisterPageProps = {
  searchParams?: { error?: string };
};

function getRegisterErrorMessage(code?: string) {
  if (code === "oauth_start_failed") {
    return "OAuth sign-up could not start. Please try again.";
  }

  return "";
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const errorMessage = getRegisterErrorMessage(searchParams?.error);

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_440px]">
          <section className="admin-card hidden p-8 lg:block">
            <p className="admin-chip">Registration</p>
            <h1 className="admin-title mt-6 text-5xl font-semibold leading-tight">
              Create a confirmed studio account.
            </h1>
            <p className="admin-muted mt-5 max-w-xl text-base leading-7">
              New accounts receive a confirmation email before they can be used.
              OAuth sign-up is available for faster onboarding, but admin access
              still requires a separate role approval.
            </p>
            <div className="mt-8 space-y-3">
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  Email confirmation
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  We send a verification link so the account starts in a trusted
                  state.
                </p>
              </div>
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  OAuth supported
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  Google and GitHub sign-up stay available with theme-aware brand
                  buttons.
                </p>
              </div>
            </div>
          </section>

          <section className="admin-card p-6 md:p-8">
            <p className="admin-chip">Create account</p>
            <h1 className="admin-title mt-5 text-3xl font-semibold">
              Start with email or OAuth
            </h1>
            <p className="admin-muted mt-3 text-sm leading-6">
              This creates a standard account for the product. Admin privileges
              are granted separately.
            </p>

            {errorMessage ? (
              <p className="admin-validation mt-5" data-variant="error">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-6">
              <RegisterForm action={signUpUser} />
            </div>

            <div className="admin-divider my-6" />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--admin-muted)]">
                OAuth sign up
              </p>
              <div className="flex flex-wrap gap-3">
                <OAuthProviderButton
                  provider="google"
                  href="/api/auth/oauth?provider=google&next=/register/complete?source=oauth-google"
                  label="Sign up with Google"
                  variant="register"
                />
                <OAuthProviderButton
                  provider="github"
                  href="/api/auth/oauth?provider=github&next=/register/complete?source=oauth-github"
                  label="Sign up with GitHub"
                  variant="register"
                />
              </div>
            </div>

            <p className="admin-muted mt-6 text-sm leading-6">
              Looking for the software overview?{" "}
              <Link href="/agitprop" className="font-semibold text-[var(--admin-accent)]">
                Visit Agitprop
              </Link>
              .{" "}
            </p>

            <p className="admin-muted mt-2 text-sm leading-6">
              Already have admin access?{" "}
              <Link href="/admin/login" className="font-semibold text-[var(--admin-accent)]">
                Go to admin login
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


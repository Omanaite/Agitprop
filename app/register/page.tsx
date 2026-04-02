import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { signUpUser } from "./actions";

export const metadata: Metadata = {
  title: "Create Account | Agitprop",
  description: "Create a standard Agitprop account with email confirmation.",
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
              Create your studio account with email and password. OAuth account
              creation is handled through artist login so sign-in and identity
              linking stay in one place.
            </p>
            <div className="mt-8 space-y-3">
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  Instant access
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  Your account is ready immediately after registration — no
                  waiting for email confirmation.
                </p>
              </div>
              <div className="admin-card-soft p-4">
                <p className="text-sm font-semibold text-[var(--admin-title)]">
                  OAuth via artist login
                </p>
                <p className="admin-muted mt-2 text-sm leading-6">
                  Use Google or GitHub from artist login to auto-create or link
                  your account.
                </p>
              </div>
            </div>
          </section>

          <section className="admin-card p-6 md:p-8">
            <p className="admin-chip">Create account</p>
            <h1 className="admin-title mt-5 text-3xl font-semibold">
              Start with email
            </h1>
            <p className="admin-muted mt-3 text-sm leading-6">
              This creates a standard account for the product. Platform admin
              privileges are managed separately.
            </p>

            {errorMessage ? (
              <p className="admin-validation mt-5" data-variant="error">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-6">
              <RegisterForm action={signUpUser} />
            </div>

            <div className="mt-8 border-t border-[var(--admin-border)] pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                OAuth sign up
              </p>
              <p className="admin-muted mt-3 text-sm leading-6">
                Use Google or GitHub to create your artist account automatically.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <OAuthProviderButton
                  provider="google"
                  href="/api/auth/oauth?provider=google&next=/register/complete?source=oauth"
                  label="Sign up with Google"
                />
                <OAuthProviderButton
                  provider="github"
                  href="/api/auth/oauth?provider=github&next=/register/complete?source=oauth"
                  label="Sign up with GitHub"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--admin-border)] pt-5">
              <p className="admin-muted text-xs leading-5">
                Already have an account?{" "}
                <a href="/studio/login" className="font-semibold text-[var(--admin-accent)]">
                  Sign in here
                </a>
                . If you registered before and cannot sign in, request a new confirmation link.
              </p>
              <ResendConfirmationForm />
            </div>

            <p className="admin-muted mt-6 text-sm leading-6">
              Looking for the software overview?{" "}
              <Link href="/agitprop" className="font-semibold text-[var(--admin-accent)]">
                Visit Agitprop
              </Link>
              .{" "}
            </p>

            <p className="admin-muted mt-2 text-sm leading-6">
              Already have platform admin access?{" "}
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

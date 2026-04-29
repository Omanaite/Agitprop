import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { MarketingNav } from "@/components/marketing/MarketingNav";
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
    <div className="marketing-shell min-h-screen">
      <MarketingNav
        rightSlot={
          <Link href="/studio/login" className="hidden text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors sm:inline">
            Sign in
          </Link>
        }
      />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-16">
        {/* Top strip: masthead */}
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted shrink-0">
            Registration / Vol.01
          </p>
          <div className="flex-1 h-px bg-[var(--mkt-border)]" />
          <div className="mkt-chip shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--mkt-success)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--mkt-success)]" />
            </span>
            <span className="hidden sm:inline">No credit card required</span>
            <span className="sm:hidden">Free</span>
          </div>
        </div>

        {/* Asymmetric layout */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Left: editorial copy */}
          <div className="col-span-12 lg:col-span-7 lg:pr-8">
            <h1 className="mkt-display text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.95]">
              Start your
              <br />
              artist site
              <br />
              <span className="mkt-muted">in minutes.</span>
            </h1>
            <p className="mt-7 max-w-md text-base sm:text-lg leading-relaxed mkt-muted">
              Create your account, pick a name, and your portfolio is live.
              No infrastructure work, no subscriptions.
            </p>

            <div className="mt-12 hidden lg:block">
              <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted mb-5">
                What you get on day one
              </p>
              <ul className="space-y-4 max-w-sm">
                {[
                  { title: "Instant access", body: "Your account is ready immediately — no waiting on email confirmation." },
                  { title: "Full free tier", body: "2 galleries, 25 pieces, 5 posts, all themes, EN/ES/DE — at no cost." },
                  { title: "OAuth or email", body: "Continue with Google, GitHub, or a regular email + password." },
                ].map((item, i) => (
                  <li key={item.title} className="grid grid-cols-[2.25rem_1fr] gap-3 items-start">
                    <span className="mkt-mono text-xs mkt-muted pt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-semibold leading-snug">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed mkt-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <section className="col-span-12 lg:col-span-5">
            <div className="mkt-card p-7 md:p-8">
              <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted">
                Create account
              </p>
              <h2 className="mkt-display mt-3 text-2xl">
                Start with email
              </h2>
              <p className="mt-2 text-sm leading-6 mkt-muted">
                Or use OAuth to skip the password.
              </p>

              {errorMessage ? (
                <p className="admin-validation mt-5" data-variant="error">
                  {errorMessage}
                </p>
              ) : null}

              <div className="mt-6">
                <RegisterForm action={signUpUser} />
              </div>

              <div className="my-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--mkt-border)]" />
                <span className="mkt-mono text-[10px] uppercase tracking-[0.18em] mkt-muted">or</span>
                <div className="flex-1 h-px bg-[var(--mkt-border)]" />
              </div>

              <div className="space-y-2.5">
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

              <div className="mt-7 pt-6 border-t border-[var(--mkt-border)] space-y-2">
                <p className="text-xs leading-5 mkt-muted">
                  Already have an account?{" "}
                  <Link href="/studio/login" className="text-[var(--mkt-fg)] underline underline-offset-4 decoration-[var(--mkt-border-strong)] hover:decoration-[var(--mkt-fg)] transition-colors">
                    Sign in
                  </Link>
                  . Need a new confirmation link?
                </p>
                <ResendConfirmationForm />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { OAuthProviderButton } from "@/components/auth/OAuthProviderButton";
import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { signInArtist } from "@/app/studio/login/actions";

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
      return "Your account needs to be confirmed before signing in. Request a new confirmation link below.";
    case "rate":
      return "Too many attempts. Please try again later.";
    default:
      return "";
  }
}

export default function StudioLoginPage({ searchParams }: LoginPageProps) {
  const errorMessage = getErrorMessage(searchParams?.error, searchParams?.reason);

  return (
    <div className="marketing-shell min-h-screen">
      <MarketingNav
        rightSlot={
          <>
            <Link href="/register" className="hidden text-sm mkt-muted hover:text-[var(--mkt-fg)] transition-colors sm:inline">
              Create account
            </Link>
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-16">
        {/* Top strip: masthead */}
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted shrink-0">
            Artist workspace / Sign in
          </p>
          <div className="flex-1 h-px bg-[var(--mkt-border)]" />
        </div>

        {/* Asymmetric layout: editorial left, form right */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          {/* Left: editorial copy */}
          <div className="col-span-12 lg:col-span-7 lg:pr-8">
            <h1 className="mkt-display text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.95]">
              Welcome
              <br />
              <span className="mkt-muted">back.</span>
            </h1>
            <p className="mt-7 max-w-md text-base sm:text-lg leading-relaxed mkt-muted">
              Pick up where you left off. Galleries, posts, bookings,
              and your studio site — all in one workspace.
            </p>

            <div className="mt-12 hidden lg:block">
              <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted mb-5">
                What&apos;s waiting inside
              </p>
              <ul className="space-y-4 max-w-sm">
                {[
                  "Booking requests from your public site",
                  "Gallery and piece editor with live previews",
                  "Posts, rates, availability, and theme settings",
                ].map((item, i) => (
                  <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-3 items-start">
                    <span className="mkt-mono text-xs mkt-muted pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <section className="col-span-12 lg:col-span-5">
            <div className="mkt-card p-7 md:p-8">
              <p className="mkt-mono text-[10px] uppercase tracking-[0.22em] mkt-muted">
                Sign in
              </p>
              <h2 className="mkt-display mt-3 text-2xl">
                Access your studio
              </h2>
              <p className="mt-2 text-sm leading-6 mkt-muted">
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
                <AdminLoginForm action={signInArtist} />
              </div>

              <div className="my-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--mkt-border)]" />
                <span className="mkt-mono text-[10px] uppercase tracking-[0.18em] mkt-muted">or</span>
                <div className="flex-1 h-px bg-[var(--mkt-border)]" />
              </div>

              <div className="space-y-2.5">
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

              <p className="mt-7 text-xs mkt-muted">
                New to Agitprop?{" "}
                <Link href="/register" className="text-[var(--mkt-fg)] underline underline-offset-4 decoration-[var(--mkt-border-strong)] hover:decoration-[var(--mkt-fg)] transition-colors">
                  Create an account
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

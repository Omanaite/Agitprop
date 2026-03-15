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
    <div className="min-h-screen bg-[var(--bg)] p-6 text-[var(--fg)] md:p-10">
      <div className="mx-auto max-w-md theme-border p-6">
        <h1 className="mb-2 font-[var(--font-heading)] text-2xl uppercase">
          Admin Login
        </h1>
        <p className="mb-6 text-sm">Admin-only access.</p>
        {errorMessage ? (
          <p
            className="validation-box mb-4"
            data-variant="error"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        ) : null}

        <form action={signInAdmin} className="flex flex-col gap-4">
          <label className="text-sm uppercase tracking-[0.2em]">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full theme-border p-2"
            />
          </label>
          <label className="text-sm uppercase tracking-[0.2em]">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full theme-border p-2"
            />
          </label>
          <button
            type="submit"
            className="theme-border theme-invert px-4 py-2"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 grid gap-2">
          <p className="text-xs uppercase tracking-[0.2em]">
            Sign in with OAuth
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              className="theme-border px-4 py-2 text-xs uppercase tracking-[0.2em]"
              href="/api/admin/integrations/oauth?provider=google"
            >
              Google
            </a>
            <a
              className="theme-border px-4 py-2 text-xs uppercase tracking-[0.2em]"
              href="/api/admin/integrations/oauth?provider=github"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export const metadata: Metadata = {
  title: "Account Status | Agitprop",
  description: "Registration completion and confirmation state for Agitprop accounts.",
  robots: {
    index: false,
    follow: false,
  },
};

type CompletePageProps = {
  searchParams?: { source?: string };
};

function getMessage(source?: string) {
  if (source?.startsWith("oauth")) {
    return {
      title: "OAuth account ready",
      body: "Your account is connected. Continue to your studio workspace to manage your site.",
    };
  }

  return {
    title: "Email confirmed",
    body: "Your email confirmation is complete. You can return to the site or continue to your studio workspace.",
  };
}

export default function RegisterCompletePage({ searchParams }: CompletePageProps) {
  const message = getMessage(searchParams?.source);

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>
        <section className="admin-card p-6 md:p-8">
          <p className="admin-chip">Account status</p>
          <h1 className="admin-title mt-5 text-3xl font-semibold">{message.title}</h1>
          <p className="admin-muted mt-4 text-sm leading-7">{message.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="admin-button admin-button-primary">
              Return to home
            </Link>
            <Link href="/studio" className="admin-button">
              Open studio workspace
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

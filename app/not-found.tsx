import Link from "next/link";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export default function NotFound() {
  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end">
          <AdminThemeToggle />
        </div>
        <section className="admin-card p-6 md:p-8">
          <p className="admin-chip">404</p>
          <h1 className="admin-title mt-5 text-4xl font-semibold">Page not found.</h1>
          <p className="admin-muted mt-4 text-sm leading-7">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/agitprop" className="admin-button admin-button-primary">
              Go to homepage
            </Link>
            <Link href="/studio/login" className="admin-button admin-button-ghost">
              Artist login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { signOutAdmin } from "@/app/admin/actions";
import { StudioConsoleShell } from "@/components/studio/StudioConsoleShell";
import { StudioSiteLink } from "@/components/studio/StudioSiteLink";

export default function StudioPage() {
  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="admin-chip">Artist workspace</p>
            <h1 className="admin-title mt-4 text-4xl font-semibold">
              Studio operations dashboard
            </h1>
            <p className="admin-muted mt-2 max-w-2xl text-sm leading-6">
              Manage studio settings in a workspace isolated from platform
              administration.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <StudioSiteLink />
            <AdminThemeToggle />
            <form action={signOutAdmin}>
              <button type="submit" className="admin-button admin-button-ghost">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <StudioConsoleShell />
      </div>
    </div>
  );
}

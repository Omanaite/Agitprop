import { cookies } from "next/headers";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { signOutAdmin } from "@/app/admin/actions";
import { StudioConsoleShell } from "@/components/studio/StudioConsoleShell";
import { StudioSiteLink } from "@/components/studio/StudioSiteLink";
import { createSupabaseServerClient } from "@/lib/supabase/ssr";
import { createSupabaseServerClient as createAdminClient } from "@/lib/supabase/server";

async function getTenantInfo() {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient({
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    });
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const adminClient = createAdminClient();
    const { data: tenant } = await adminClient
      .from("artist_tenants")
      .select("studio_name,slug")
      .eq("owner_user_id", data.user.id)
      .maybeSingle();

    return tenant ?? null;
  } catch {
    return null;
  }
}

export default async function StudioPage() {
  const tenant = await getTenantInfo();
  const studioTitle = tenant?.studio_name ?? "Your studio";

  return (
    <div className="admin-shell px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="admin-chip">Artist workspace</p>
            <h1 className="admin-title mt-4 text-4xl font-semibold">
              {studioTitle}
            </h1>
            <p className="admin-muted mt-2 max-w-2xl text-sm leading-6">
              Manage your galleries, posts, bookings, and site settings.
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

import { cookies } from "next/headers";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";
import { signOutArtist } from "@/app/studio/actions";
import { StudioConsoleShell } from "@/components/studio/StudioConsoleShell";
import { StudioSiteLink } from "@/components/studio/StudioSiteLink";
import { StudioSplitLayout } from "@/components/studio/StudioSplitLayout";
import { StudioPreviewProvider } from "@/lib/studio-preview-context";
import { StudioSlugLoader } from "@/components/studio/StudioSlugLoader";
import { StudioChatbot } from "@/components/studio/StudioChatbot";
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
  const slug = tenant?.slug ?? null;

  return (
    <StudioPreviewProvider>
      {slug && <StudioSlugLoader slug={slug} />}

      <div
        className="admin-shell flex flex-col"
        style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}
      >
        {/* ── Top bar ── */}
        <header
          className="shrink-0 flex items-center justify-between px-5 md:px-6"
          style={{
            height: "56px",
            borderBottom: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
            backdropFilter: "blur(12px)",
            zIndex: 30,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.14em] shrink-0"
              style={{ color: "var(--admin-muted)" }}
            >
              Studio
            </span>
            <span
              className="shrink-0"
              style={{ width: "1px", height: "14px", background: "var(--admin-border)" }}
            />
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--admin-title)" }}
            >
              {studioTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StudioSiteLink />
            <AdminThemeToggle />
            <form action={signOutArtist}>
              <button
                type="submit"
                className="admin-button admin-button-ghost"
                style={{ padding: "0.45rem 0.8rem", fontSize: "0.78rem" }}
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* ── Body (sidebar + content) ── */}
        <div className="flex flex-1 min-h-0">
          <StudioSplitLayout>
            <StudioConsoleShell />
          </StudioSplitLayout>
        </div>
      </div>

      <StudioChatbot />
    </StudioPreviewProvider>
  );
}

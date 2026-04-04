import type { ArtistTenant } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export async function getArtistTenantBySlug(
  slug: string
): Promise<ArtistTenant | null> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("artist_tenants")
      .select(
        "id,owner_user_id,studio_name,slug,status,plan_code,site_theme,custom_domain,rates,created_at,updated_at"
      )
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as ArtistTenant | null;
  } catch {
    return null;
  }
}

export async function getActiveArtistSlugs(): Promise<string[]> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("artist_tenants")
      .select("slug")
      .eq("status", "active");
    if (error) throw error;
    return (data ?? []).map((row) => String((row as { slug: string }).slug));
  } catch {
    return [];
  }
}

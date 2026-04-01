import type { Gallery } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Fetch galleries from Supabase.
export async function getGalleries(ownerUserId?: string | null): Promise<Gallery[]> {
  try {
    const client = createSupabasePublicClient();
    let query = client
      .from("galleries")
      .select("id,title,description,slug,created_at")
      .order("created_at", { ascending: false });
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Gallery[];
  } catch {
    return [];
  }
}

export async function getGalleryBySlug(
  slug: string,
  ownerUserId?: string | null
): Promise<Gallery | null> {
  try {
    const client = createSupabasePublicClient();
    let query = client
      .from("galleries")
      .select("id,title,description,slug,created_at")
      .eq("slug", slug);
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    return (data ?? null) as Gallery | null;
  } catch {
    return null;
  }
}

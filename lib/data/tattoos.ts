import type { Tattoo } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { FALLBACK_TATTOOS } from "@/lib/data/fallback";

// Fetch tattoos from Supabase with a safe fallback when env vars are missing.
export async function getTattooGallery(
  ownerUserId?: string | null
): Promise<Tattoo[]> {
  try {
    const client = createSupabasePublicClient();
    let query = client
      .from("tattoos")
      .select(
        "id,title,description,style,image_url,gallery_id,tags,location_link,session_length_minutes,sort_order,created_at"
      )
      .order("created_at", { ascending: false });
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Tattoo[];
  } catch {
    return FALLBACK_TATTOOS;
  }
}

export async function getTattoosByGalleryId(
  galleryId: string,
  ownerUserId?: string | null
): Promise<Tattoo[]> {
  try {
    const client = createSupabasePublicClient();
    let query = client
      .from("tattoos")
      .select(
        "id,title,description,style,image_url,gallery_id,tags,location_link,session_length_minutes,aftercare,sort_order,created_at"
      )
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Tattoo[];
  } catch {
    return [];
  }
}

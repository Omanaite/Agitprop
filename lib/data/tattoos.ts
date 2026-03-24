import type { Tattoo } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { FALLBACK_TATTOOS } from "@/lib/data/fallback";

// Fetch tattoos from Supabase with a safe fallback when env vars are missing.
export async function getTattooGallery(): Promise<Tattoo[]> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("tattoos")
      .select(
        "id,title,description,style,image_url,gallery_id,created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Tattoo[];
  } catch {
    return FALLBACK_TATTOOS;
  }
}

export async function getTattoosByGalleryId(
  galleryId: string
): Promise<Tattoo[]> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("tattoos")
      .select(
        "id,title,description,style,image_url,gallery_id,tags,location_link,session_length_minutes,aftercare,sort_order,created_at"
      )
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Tattoo[];
  } catch {
    return [];
  }
}

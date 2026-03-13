import type { Gallery } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Fetch galleries from Supabase.
export async function getGalleries(): Promise<Gallery[]> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("galleries")
      .select("id,title,description,slug,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Gallery[];
  } catch {
    return [];
  }
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("galleries")
      .select("id,title,description,slug,created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data ?? null) as Gallery | null;
  } catch {
    return null;
  }
}

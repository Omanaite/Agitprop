import type { Post } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Fetch published posts from Supabase.
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const client = createSupabasePublicClient();
    const now = new Date().toISOString();
    const { data, error } = await client
      .from("posts")
      .select("id,title,body,excerpt,cover_image_url,status,publish_at,created_at,updated_at")
      .eq("status", "published")
      .or(`publish_at.is.null,publish_at.lte.${now}`)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

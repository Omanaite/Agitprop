import { unstable_cache } from "next/cache";
import type { Post } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

async function _getPublishedPosts(ownerUserId?: string | null): Promise<Post[]> {
  try {
    const client = createSupabasePublicClient();
    const now = new Date().toISOString();
    let query = client
      .from("posts")
      .select("id,title,body,excerpt,cover_image_url,status,publish_at,created_at,updated_at")
      .eq("status", "published")
      .or(`publish_at.is.null,publish_at.lte.${now}`)
      .order("created_at", { ascending: false });
    if (ownerUserId) {
      query = query.eq("owner_user_id", ownerUserId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}

export const getPublishedPosts = unstable_cache(
  _getPublishedPosts,
  ["published-posts"],
  { revalidate: 60, tags: ["posts"] }
);

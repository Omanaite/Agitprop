import type { Post } from "@/types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

// Fetch published posts from Supabase.
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("posts")
      .select("id,title,body,status,created_at,updated_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as Post[];
  } catch {
    return [];
  }
}


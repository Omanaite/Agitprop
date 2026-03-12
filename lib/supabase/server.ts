import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using service role for privileged operations.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase server env vars are missing.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

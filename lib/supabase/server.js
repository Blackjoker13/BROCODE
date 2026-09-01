import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client.
 * Uses SUPABASE_SECRET_KEY for backend/administrative operations.
 * NEVER import this file into Client Components.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zswmhbimaqrdfjfpbcrht.supabase.co";
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set in server environment variables.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

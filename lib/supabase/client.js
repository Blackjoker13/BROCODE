import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zswmhbimaqrdfjfpbcrht.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

/**
 * Browser-safe Supabase client.
 * Uses public publishable key only.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

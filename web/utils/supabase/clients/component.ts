/* From https://supabase.com/docs/guides/auth/server-side/nextjs */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabase;
}

import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { isSupabaseAdminConfigured, supabaseServiceRoleKey, supabaseUrl } from "./env";

/**
 * Service-role client. Bypasses RLS entirely — only for the trusted server
 * path that saves a public form submission as a lead. Never expose this
 * client, or the key it holds, to the browser or to a Client Component.
 */
export function createSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient<Database>(supabaseUrl()!, supabaseServiceRoleKey()!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { isSupabasePublicConfigured, supabaseAnonKey, supabaseUrl } from "./env";

/**
 * RLS-respecting client for Server Components/Actions in /admin, bound to the
 * signed-in user's session cookie. Never bypasses RLS — that's `admin.ts`.
 */
export async function createSupabaseServerClient() {
  if (!isSupabasePublicConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl()!, supabaseAnonKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component that can't set cookies; middleware
          // refreshes the session on the next request instead.
        }
      },
    },
  });
}

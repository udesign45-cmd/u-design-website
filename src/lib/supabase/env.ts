/** Shared env accessors so every Supabase client agrees on what "configured" means. */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function supabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function supabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isSupabasePublicConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseServiceRoleKey());
}

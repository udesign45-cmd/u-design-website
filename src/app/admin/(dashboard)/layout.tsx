import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

// Every page here reads the caller's session and RLS-scoped data; none of it
// can be statically prerendered or cached across users.
export const dynamic = "force-dynamic";

/** Defense in depth: middleware already gates /admin, this re-checks per request. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return <AdminShell userEmail={user.email ?? "Signed in"}>{children}</AdminShell>;
}

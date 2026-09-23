import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { LeadInsert, PlanTier } from "@/lib/supabase/types";
import type { Lead } from "@/lib/forms/delivery/types";

const PLAN_TIERS: PlanTier[] = ["basic", "standard", "premium"];

/**
 * Best-effort save to the leads dashboard. Never throws: email/webhook
 * delivery to the visitor must not depend on Supabase being configured, so a
 * missing project (local dev, CI) silently no-ops instead of failing the form.
 */
export async function saveLeadToDashboard(lead: Lead, plan?: string): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;

  const row: LeadInsert = {
    id: lead.id,
    submitted_at: lead.submittedAt,
    source_page: lead.sourcePage,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    industry: lead.industry.value,
    industry_label: lead.industry.label,
    service: lead.need.value,
    service_label: lead.need.label,
    plan: plan && PLAN_TIERS.includes(plan as PlanTier) ? (plan as PlanTier) : null,
    budget: lead.budget?.value ?? null,
    budget_label: lead.budget?.label ?? null,
    message: lead.message ?? null,
  };

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("leads").upsert(row, { onConflict: "id" });
    if (error) console.error("[lead-store]", { id: lead.id, reason: error.message });
  } catch (error) {
    console.error("[lead-store]", {
      id: lead.id,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
}

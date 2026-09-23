import type { LeadStatus, PlanTier } from "@/lib/supabase/types";

/**
 * No "server-only" import here on purpose: client components (StatusSelect,
 * LeadsToolbar) need these lists too, and importing them from queries.ts
 * would pull the Supabase server client into the client bundle.
 */
export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "follow_up",
  "converted",
  "lost",
];

export const PLAN_TIERS: PlanTier[] = ["basic", "standard", "premium"];

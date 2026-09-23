import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadNoteRow, LeadRow, LeadStatus, PlanTier } from "@/lib/supabase/types";
import { LEAD_STATUSES, PLAN_TIERS } from "./constants";

export { LEAD_STATUSES, PLAN_TIERS } from "./constants";

export type LeadsSort = "created_at" | "name" | "company" | "status";

export type LeadsQuery = {
  q?: string;
  status?: LeadStatus[];
  service?: string[];
  plan?: PlanTier[];
  dateFrom?: string;
  dateTo?: string;
  sort?: LeadsSort;
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type LeadsPage = { rows: LeadRow[]; total: number; page: number; pageSize: number };

function escapeIlike(value: string): string {
  return value.replace(/[%_,]/g, (m) => `\\${m}`);
}

/** Filtered, sorted, paginated leads for the dashboard table (RLS: authenticated only). */
export async function listLeads(query: LeadsQuery): Promise<LeadsPage> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 25));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let builder = supabase.from("leads").select("*", { count: "exact" });

  if (query.q) {
    const term = escapeIlike(query.q.trim());
    if (term) {
      builder = builder.or(
        [`name.ilike.%${term}%`, `company.ilike.%${term}%`, `email.ilike.%${term}%`, `phone.ilike.%${term}%`].join(
          ",",
        ),
      );
    }
  }
  if (query.status?.length) builder = builder.in("status", query.status);
  if (query.service?.length) builder = builder.in("service", query.service);
  if (query.plan?.length) builder = builder.in("plan", query.plan);
  if (query.dateFrom) builder = builder.gte("submitted_at", query.dateFrom);
  if (query.dateTo) builder = builder.lte("submitted_at", query.dateTo);

  const sort = query.sort ?? "created_at";
  const ascending = query.dir === "asc";
  builder = builder.order(sort, { ascending }).range(from, to);

  const { data, error, count } = await builder;
  if (error) throw new Error(`listLeads: ${error.message}`);
  return { rows: data ?? [], total: count ?? 0, page, pageSize };
}

const EXPORT_CAP = 10_000;

/** Same filters as listLeads, but every matching row (up to a sane cap) for export. */
export async function listLeadsForExport(
  query: Omit<LeadsQuery, "page" | "pageSize">,
): Promise<LeadRow[]> {
  const supabase = await createSupabaseServerClient();
  let builder = supabase.from("leads").select("*");

  if (query.q) {
    const term = escapeIlike(query.q.trim());
    if (term) {
      builder = builder.or(
        [`name.ilike.%${term}%`, `company.ilike.%${term}%`, `email.ilike.%${term}%`, `phone.ilike.%${term}%`].join(
          ",",
        ),
      );
    }
  }
  if (query.status?.length) builder = builder.in("status", query.status);
  if (query.service?.length) builder = builder.in("service", query.service);
  if (query.plan?.length) builder = builder.in("plan", query.plan);
  if (query.dateFrom) builder = builder.gte("submitted_at", query.dateFrom);
  if (query.dateTo) builder = builder.lte("submitted_at", query.dateTo);

  const sort = query.sort ?? "created_at";
  const ascending = query.dir === "asc";
  builder = builder.order(sort, { ascending }).range(0, EXPORT_CAP - 1);

  const { data, error } = await builder;
  if (error) throw new Error(`listLeadsForExport: ${error.message}`);
  return data ?? [];
}

export async function getLead(id: string): Promise<LeadRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getLead: ${error.message}`);
  return data;
}

export async function getLeadNotes(leadId: string): Promise<LeadNoteRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`getLeadNotes: ${error.message}`);
  return data ?? [];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(`updateLeadStatus: ${error.message}`);
}

export async function addLeadNote(
  leadId: string,
  body: string,
  author: { id: string; email: string },
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: leadId, body, created_by: author.id, author_email: author.email });
  if (error) throw new Error(`addLeadNote: ${error.message}`);
}

export type LeadCounts = { total: number; new: number; converted: number };

/** Cheap header-stat counts (head-only queries, no rows fetched). */
export async function getLeadCounts(): Promise<LeadCounts> {
  const supabase = await createSupabaseServerClient();
  const [total, newCount, converted] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "converted"),
  ]);
  if (total.error) throw new Error(`getLeadCounts: ${total.error.message}`);
  return { total: total.count ?? 0, new: newCount.count ?? 0, converted: converted.count ?? 0 };
}

export type LeadAnalytics = {
  total: number;
  byStatus: { status: LeadStatus; count: number }[];
  byService: { service: string; count: number }[];
  byPlan: { plan: PlanTier; count: number }[];
  byDay: { date: string; count: number }[];
  conversionRate: number;
};

/** Aggregates computed in JS over a bounded window (leads volume here never needs SQL rollups). */
export async function getLeadAnalytics(days = 90): Promise<LeadAnalytics> {
  const supabase = await createSupabaseServerClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("leads")
    .select("status, service, plan, submitted_at")
    .gte("submitted_at", since);
  if (error) throw new Error(`getLeadAnalytics: ${error.message}`);
  const rows = data ?? [];

  const statusCounts = new Map<LeadStatus, number>();
  const serviceCounts = new Map<string, number>();
  const planCounts = new Map<PlanTier, number>();
  const dayCounts = new Map<string, number>();

  for (const row of rows) {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
    if (row.service) serviceCounts.set(row.service, (serviceCounts.get(row.service) ?? 0) + 1);
    if (row.plan) planCounts.set(row.plan, (planCounts.get(row.plan) ?? 0) + 1);
    const day = row.submitted_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }

  const byDay: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    byDay.push({ date, count: dayCounts.get(date) ?? 0 });
  }

  const converted = statusCounts.get("converted") ?? 0;

  return {
    total: rows.length,
    byStatus: LEAD_STATUSES.map((status) => ({ status, count: statusCounts.get(status) ?? 0 })),
    byService: [...serviceCounts.entries()]
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count),
    byPlan: PLAN_TIERS.map((plan) => ({ plan, count: planCounts.get(plan) ?? 0 })),
    byDay,
    conversionRate: rows.length > 0 ? converted / rows.length : 0,
  };
}

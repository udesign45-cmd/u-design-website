import { getFormOptions } from "@/lib/content/form-options";
import { getLeadCounts, listLeads, type LeadsSort } from "@/lib/leads/queries";
import type { LeadStatus, PlanTier } from "@/lib/supabase/types";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { LeadsToolbar } from "@/components/admin/LeadsToolbar";
import { ExportButtons } from "@/components/admin/ExportButtons";
import { Pagination } from "@/components/admin/ui/Pagination";
import { StatTile } from "@/components/admin/ui/StatTile";

export const metadata = { title: "Leads" };

type SearchParams = {
  q?: string;
  status?: string;
  service?: string;
  plan?: string;
  sort?: string;
  dir?: string;
  page?: string;
};

const SORT_FIELDS: LeadsSort[] = ["created_at", "name", "company", "status"];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = (params.status?.split(",").filter(Boolean) ?? []) as LeadStatus[];
  const service = params.service ? [params.service] : undefined;
  const plan = params.plan ? ([params.plan] as PlanTier[]) : undefined;
  const sort = SORT_FIELDS.includes(params.sort as LeadsSort) ? (params.sort as LeadsSort) : "created_at";
  const dir = params.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows, total, pageSize }, counts] = await Promise.all([
    listLeads({ q: params.q, status, service, plan, sort, dir, page }),
    getLeadCounts(),
  ]);

  const services = getFormOptions().needs.filter((n) => n.value !== "not-sure");

  const baseParams = new URLSearchParams();
  if (params.q) baseParams.set("q", params.q);
  if (params.status) baseParams.set("status", params.status);
  if (params.service) baseParams.set("service", params.service);
  if (params.plan) baseParams.set("plan", params.plan);
  if (params.sort) baseParams.set("sort", params.sort);
  if (params.dir) baseParams.set("dir", params.dir);
  const queryString = baseParams.toString();

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Leads</h1>
          <p className="mt-1 text-sm text-ink-muted">Every consultation request from the website.</p>
        </div>
        <ExportButtons queryString={queryString} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total leads" value={String(counts.total)} icon="list-checks" accent />
        <StatTile label="New" value={String(counts.new)} icon="circle-alert" />
        <StatTile label="Converted" value={String(counts.converted)} icon="circle-check" />
      </div>

      <LeadsToolbar services={services} />

      <LeadsTable rows={rows} />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        buildHref={(p) => {
          const next = new URLSearchParams(baseParams);
          if (p > 1) next.set("page", String(p));
          else next.delete("page");
          const qs = next.toString();
          return `/admin/leads${qs ? `?${qs}` : ""}`;
        }}
      />
    </div>
  );
}

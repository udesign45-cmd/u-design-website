import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { LeadRow } from "@/lib/supabase/types";
import { StatusSelect } from "./StatusSelect";

const PLAN_LABEL: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function LeadsTable({ rows }: { rows: LeadRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-white p-12 text-center">
        <p className="text-sm font-medium text-ink">No leads match these filters</p>
        <p className="mt-1 text-sm text-ink-muted">Try clearing a filter or searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-medium text-ink-muted">
              <th className="px-4 py-3 font-medium">Lead</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} className="border-b border-line last:border-b-0 hover:bg-surface-gray/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{lead.name}</p>
                  <p className="text-xs text-ink-muted">{lead.company}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink">{lead.email}</p>
                  <p className="text-xs text-ink-muted">{lead.phone}</p>
                </td>
                <td className="px-4 py-3 text-ink">{lead.service_label ?? "—"}</td>
                <td className="px-4 py-3 text-ink">
                  {lead.plan ? (PLAN_LABEL[lead.plan] ?? lead.plan) : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{lead.source_page}</td>
                <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                  {formatDate(lead.submitted_at)}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-gray hover:text-ink"
                  >
                    <Icon name="chevron-right" size={16} label={`Open ${lead.name}`} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

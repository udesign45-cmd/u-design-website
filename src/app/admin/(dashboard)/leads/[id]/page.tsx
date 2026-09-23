import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { getLead, getLeadNotes } from "@/lib/leads/queries";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { NotesPanel } from "@/components/admin/NotesPanel";

const PLAN_LABEL: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value || "—"}</p>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, notes] = await Promise.all([getLead(id), getLeadNotes(id)]);
  if (!lead) notFound();

  const submittedAt = new Date(lead.submitted_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <Icon name="chevron-left" size={16} />
        All leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-line bg-white p-6">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">{lead.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {lead.company} · Submitted {submittedAt}
          </p>
        </div>
        <StatusSelect leadId={lead.id} status={lead.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Contact</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Company" value={lead.company} />
              <Field label="Industry" value={lead.industry_label ?? ""} />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">Request</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Service" value={lead.service_label ?? ""} />
              <Field label="Selected plan" value={lead.plan ? (PLAN_LABEL[lead.plan] ?? lead.plan) : ""} />
              <Field label="Budget" value={lead.budget_label ?? ""} />
              <Field label="Source page" value={lead.source_page} />
            </div>
            {lead.message ? (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-xs font-medium text-ink-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{lead.message}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-2">
          <NotesPanel leadId={lead.id} notes={notes} />
        </div>
      </div>
    </div>
  );
}

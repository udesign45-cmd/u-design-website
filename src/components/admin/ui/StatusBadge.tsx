import type { LeadStatus } from "@/lib/supabase/types";

export const STATUS_META: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "var(--color-admin-status-new)" },
  contacted: { label: "Contacted", color: "var(--color-admin-status-contacted)" },
  follow_up: { label: "Follow Up", color: "var(--color-admin-status-follow-up)" },
  converted: { label: "Converted", color: "var(--color-admin-status-converted)" },
  lost: { label: "Lost", color: "var(--color-admin-status-lost)" },
};

/** Color is never the only signal: a labeled dot, never a bare color chip. */
export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink">
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  );
}

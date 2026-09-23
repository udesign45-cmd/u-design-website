"use client";

import { startTransition, useOptimistic } from "react";
import { changeLeadStatus } from "@/app/admin/(dashboard)/leads/actions";
import { LEAD_STATUSES } from "@/lib/leads/constants";
import type { LeadStatus } from "@/lib/supabase/types";
import { STATUS_META } from "./ui/StatusBadge";

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  function onChange(next: LeadStatus) {
    setOptimisticStatus(next);
    startTransition(async () => {
      await changeLeadStatus(leadId, next);
    });
  }

  const meta = STATUS_META[optimisticStatus];

  return (
    <div className="relative inline-flex items-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <select
        aria-label="Lead status"
        value={optimisticStatus}
        onChange={(e) => onChange(e.target.value as LeadStatus)}
        className="appearance-none rounded-full border border-line bg-white py-1 pr-7 pl-6 text-xs font-medium text-ink outline-none transition-colors hover:border-ink/30 focus:border-brand-green-dark"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}

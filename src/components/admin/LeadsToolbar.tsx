"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { LEAD_STATUSES } from "@/lib/leads/constants";
import { STATUS_META } from "./ui/StatusBadge";
import type { LabelledValue } from "@/lib/forms/delivery/types";

const SORTS = [
  { value: "created_at:desc", label: "Newest first" },
  { value: "created_at:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A–Z" },
  { value: "company:asc", label: "Company A–Z" },
  { value: "status:asc", label: "Status" },
];

const PLANS = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const selectClasses =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-brand-green-dark";

export function LeadsToolbar({ services }: { services: LabelledValue[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeStatuses = new Set((searchParams.get("status") ?? "").split(",").filter(Boolean));
  const service = searchParams.get("service") ?? "";
  const plan = searchParams.get("plan") ?? "";
  const sort = `${searchParams.get("sort") ?? "created_at"}:${searchParams.get("dir") ?? "desc"}`;
  const hasFilters = activeStatuses.size > 0 || service || plan || (searchParams.get("q") ?? "");

  function update(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (q !== (searchParams.get("q") ?? "")) update({ q: q || null });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function toggleStatus(status: string) {
    const next = new Set(activeStatuses);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    update({ status: [...next].join(",") || null });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, company, email or phone…"
            className="w-full rounded-lg border border-line bg-white py-2 pr-3 pl-9 text-sm text-ink outline-none transition-colors focus:border-brand-green-dark"
          />
        </div>
        <select
          value={service}
          onChange={(e) => update({ service: e.target.value || null })}
          className={selectClasses}
          aria-label="Filter by service"
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={plan}
          onChange={(e) => update({ plan: e.target.value || null })}
          className={selectClasses}
          aria-label="Filter by plan"
        >
          <option value="">All plans</option>
          {PLANS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            const [s, dir] = e.target.value.split(":");
            update({ sort: s ?? null, dir: dir ?? null });
          }}
          className={selectClasses}
          aria-label="Sort leads"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {LEAD_STATUSES.map((status) => {
          const active = activeStatuses.has(status);
          const meta = STATUS_META[status];
          return (
            <button
              key={status}
              type="button"
              onClick={() => toggleStatus(status)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </button>
          );
        })}
        {hasFilters ? (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

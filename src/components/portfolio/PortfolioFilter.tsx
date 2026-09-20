"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import type { Option } from "@/types/content";

type Item = { industry: string; solutions: string[] };

type PortfolioFilterProps = {
  industries: Option[];
  solutions: Option[];
  items: Item[];
  /** id of the list whose <li data-industry data-solutions> items are filtered */
  listId: string;
};

const FILTER_THRESHOLD = 6;

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function parse(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return { industry: params.get("industry") ?? "", solution: params.get("solution") ?? "" };
}

function matches(item: Item, filter: { industry: string; solution: string }) {
  return (
    (!filter.industry || item.industry === filter.industry) &&
    (!filter.solution || item.solutions.includes(filter.solution))
  );
}

/**
 * Client-side portfolio filter (spec FR-050). Renders only when there are more
 * than 6 projects; the full list is always present in the server HTML.
 * Filter state lives in the URL hash so it can be shared.
 */
export function PortfolioFilter({ industries, solutions, items, listId }: PortfolioFilterProps) {
  const id = useId();
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const filter = parse(hash);
  const enabled = items.length > FILTER_THRESHOLD;
  const visible = items.filter((item) => matches(item, filter)).length;

  useEffect(() => {
    if (!enabled) return;
    const current = parse(hash);
    document.querySelectorAll<HTMLElement>(`#${CSS.escape(listId)} > li`).forEach((li) => {
      li.hidden = !matches(
        { industry: li.dataset.industry ?? "", solutions: (li.dataset.solutions ?? "").split(" ") },
        current,
      );
    });
  }, [hash, listId, enabled]);

  if (!enabled) return null;

  const update = (next: { industry: string; solution: string }) => {
    const params = new URLSearchParams();
    if (next.industry) params.set("industry", next.industry);
    if (next.solution) params.set("solution", next.solution);
    window.location.hash = params.toString();
  };

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
      <div>
        <label htmlFor={`${id}-industry`} className="mb-1.5 block text-small font-medium">
          Industry
        </label>
        <select
          id={`${id}-industry`}
          value={filter.industry}
          onChange={(e) => update({ ...filter, industry: e.target.value })}
          className="min-h-11 rounded-control border border-control-border bg-white px-3"
          data-track="portfolio_filter"
        >
          <option value="">All industries</option>
          {industries.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-solution`} className="mb-1.5 block text-small font-medium">
          Solution type
        </label>
        <select
          id={`${id}-solution`}
          value={filter.solution}
          onChange={(e) => update({ ...filter, solution: e.target.value })}
          className="min-h-11 rounded-control border border-control-border bg-white px-3"
          data-track="portfolio_filter"
        >
          <option value="">All solutions</option>
          {solutions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <p className="text-small text-ink-muted sm:ml-auto" aria-live="polite">
        Showing {visible} of {items.length} projects
      </p>
    </div>
  );
}

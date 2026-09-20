import type { Stat } from "@/types/content";

/** A verified statistic (constitution II). Pass only items from getVerifiedStats(). */
export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-card border border-line bg-white p-6">
      <dt className="text-small text-ink-muted">{stat.label}</dt>
      <dd className="mt-2 font-heading text-h2 font-bold text-ink">{stat.value}</dd>
    </div>
  );
}

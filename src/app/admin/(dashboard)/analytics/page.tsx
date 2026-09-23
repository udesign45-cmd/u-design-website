import { getFormOptions } from "@/lib/content/form-options";
import { getLeadAnalytics } from "@/lib/leads/queries";
import { StatTile } from "@/components/admin/ui/StatTile";
import { STATUS_META } from "@/components/admin/ui/StatusBadge";
import { BarList, type BarListItem } from "@/components/admin/charts/BarList";
import { TrendChart } from "@/components/admin/charts/TrendChart";

export const metadata = { title: "Analytics" };

const CHART_COLORS = [
  "var(--color-admin-chart-1)",
  "var(--color-admin-chart-2)",
  "var(--color-admin-chart-3)",
  "var(--color-admin-chart-4)",
  "var(--color-admin-chart-5)",
  "var(--color-admin-chart-6)",
  "var(--color-admin-chart-7)",
  "var(--color-admin-chart-8)",
];

const PLAN_LABEL: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}

export default async function AnalyticsPage() {
  const analytics = await getLeadAnalytics(90);
  const serviceLabels = new Map(getFormOptions().needs.map((n) => [n.value, n.label]));

  const statusItems: BarListItem[] = analytics.byStatus.map((s) => ({
    label: STATUS_META[s.status].label,
    value: s.count,
    color: STATUS_META[s.status].color,
  }));

  const topServices = analytics.byService.slice(0, 8);
  const otherCount = analytics.byService.slice(8).reduce((sum, s) => sum + s.count, 0);
  const serviceItems: BarListItem[] = topServices.map((s, i) => ({
    label: serviceLabels.get(s.service) ?? s.service,
    value: s.count,
    color: CHART_COLORS[i]!,
  }));
  if (otherCount > 0) serviceItems.push({ label: "Other", value: otherCount, color: "#c3c2b7" });

  const planItems: BarListItem[] = analytics.byPlan.map((p, i) => ({
    label: PLAN_LABEL[p.plan] ?? p.plan,
    value: p.count,
    color: CHART_COLORS[i]!,
  }));

  const leadsThisWeek = analytics.byDay.slice(-7).reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">Last 90 days.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Leads (90 days)" value={String(analytics.total)} icon="trending-up" accent />
        <StatTile label="Leads this week" value={String(leadsThisWeek)} icon="chart-column" />
        <StatTile
          label="Conversion rate"
          value={`${Math.round(analytics.conversionRate * 100)}%`}
          icon="circle-check"
        />
      </div>

      <Card title="Leads over time">
        <TrendChart points={analytics.byDay} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="By status">
          <BarList items={statusItems} />
        </Card>
        <Card title="By service">
          <BarList items={serviceItems} />
        </Card>
        <Card title="By plan">
          <BarList items={planItems} />
        </Card>
      </div>
    </div>
  );
}

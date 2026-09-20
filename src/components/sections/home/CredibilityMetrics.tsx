import { StatCard } from "@/components/cards/StatCard";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getVerifiedStats } from "@/lib/content";

/** Renders only with at least 3 verified statistics (constitution II). Empty at launch. */
export function CredibilityMetrics() {
  const stats = getVerifiedStats();
  if (stats.length < 3) return null;
  return (
    <Section surface="gray" id="metrics" labelledBy="metrics-heading" spacing="compact">
      <SectionHeading id="metrics-heading" level={2} title="U Design in numbers" />
      <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </dl>
    </Section>
  );
}

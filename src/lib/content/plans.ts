import { getMarketingPages, getSolutionPages } from "@/lib/content";
import type { IconName, TitledText } from "@/types/content";

export type PlanTier = "basic" | "standard" | "premium";

export type PlannableService = {
  slug: string;
  name: string;
  summary: string;
  icon: IconName;
  category: "software" | "marketing";
  features: TitledText[];
  benefits: TitledText[];
};

export type PlanTierContent = {
  tier: PlanTier;
  label: string;
  description: string;
  included: TitledText[];
};

/** Every solution and marketing service with its own page, in one flat, pickable list. */
export function getPlannableServices(): PlannableService[] {
  return [
    ...getSolutionPages().map((s) => ({
      slug: s.slug,
      name: s.name,
      summary: s.summary,
      icon: s.icon,
      category: "software" as const,
      features: s.features,
      benefits: s.benefits,
    })),
    ...getMarketingPages().map((m) => ({
      slug: m.slug,
      name: m.name,
      summary: m.summary,
      icon: m.icon,
      category: "marketing" as const,
      features: m.features,
      benefits: m.benefits,
    })),
  ];
}

/**
 * Basic / Standard / Premium as progressively more of a service's own published
 * features (never invented ones): Basic shows the essentials, Standard shows most
 * of the build-out, Premium shows the full feature set plus the outcomes it
 * delivers. Exact tier boundaries are a starting point for the business to refine.
 */
export function buildPlanTiers(service: PlannableService): PlanTierContent[] {
  const { features, benefits } = service;
  const basicCount = Math.max(2, Math.ceil(features.length / 3));
  const standardCount = Math.max(basicCount + 1, Math.ceil((features.length * 2) / 3));
  return [
    {
      tier: "basic",
      label: "Basic",
      description: "The essentials, for a focused starting scope.",
      included: features.slice(0, basicCount),
    },
    {
      tier: "standard",
      label: "Standard",
      description: "Most of the build-out, for a complete first implementation.",
      included: features.slice(0, standardCount),
    },
    {
      tier: "premium",
      label: "Premium",
      description: "The full feature set, plus the outcomes it's built to deliver.",
      included: [...features, ...benefits],
    },
  ];
}

import { industries } from "@/content/industries";
import type { Industry, IndustryPage } from "@/types/content";
import { hasPage, isVisible } from "./core";

const byPriority = (a: Industry, b: Industry) => a.priority - b.priority;

export function getIndustries(): Industry[] {
  return industries.filter(isVisible).sort(byPriority);
}

export function getIndustry(slug: string): Industry | undefined {
  return getIndustries().find((i) => i.slug === slug);
}

export function getIndustryPages(): IndustryPage[] {
  return getIndustries().filter(hasPage) as IndustryPage[];
}

export function getIndustryPage(slug: string): IndustryPage | undefined {
  return getIndustryPages().find((i) => i.slug === slug);
}

export function getAllIndustries(): Industry[] {
  return [...industries].sort(byPriority);
}

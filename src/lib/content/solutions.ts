import { solutions } from "@/content/solutions";
import type { Solution, SolutionPage } from "@/types/content";
import { byOrder, hasPage, isVisible } from "./core";

export function getSolutions(): Solution[] {
  return solutions.filter(isVisible).sort(byOrder);
}

export function getSolution(slug: string): Solution | undefined {
  return getSolutions().find((s) => s.slug === slug);
}

export function getSolutionPages(): SolutionPage[] {
  return getSolutions().filter(hasPage) as SolutionPage[];
}

export function getSolutionPage(slug: string): SolutionPage | undefined {
  return getSolutionPages().find((s) => s.slug === slug);
}

/** All solutions regardless of status (used for form options). */
export function getAllSolutions(): Solution[] {
  return [...solutions].sort(byOrder);
}

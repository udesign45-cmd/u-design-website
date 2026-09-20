import { projects } from "@/content/projects";
import type { Project } from "@/types/content";
import { includeDrafts, isVisible } from "./core";

export type ProjectFilter = { industry?: string; solution?: string };

export function getProjects(filter: ProjectFilter = {}): Project[] {
  return projects
    .filter(isVisible)
    .filter((p) => !filter.industry || p.industry === filter.industry)
    .filter((p) => !filter.solution || p.solutionTypes.includes(filter.solution));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function usesPlaceholder(project: Project): boolean {
  return (
    project.screenshots.some((s) => s.image.isPlaceholder) || Boolean(project.cover?.isPlaceholder)
  );
}

/**
 * A project has a detail page when it is visible, has narrative content and at
 * least one screenshot. In production, placeholder screenshots disqualify it (T121).
 */
export function projectHasPage(project: Project): boolean {
  if (!isVisible(project)) return false;
  if (!project.challenge || !project.solution || !project.businessApplication || !project.seo)
    return false;
  if (project.screenshots.length === 0) return false;
  if (usesPlaceholder(project) && !includeDrafts()) return false;
  return true;
}

export function getProjectPages(): Project[] {
  return getProjects().filter(projectHasPage);
}

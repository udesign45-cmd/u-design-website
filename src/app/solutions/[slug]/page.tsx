import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionTemplate } from "@/components/templates/SolutionTemplate";
import {
  getIndustries,
  getProjects,
  getSolutionPage,
  getSolutionPages,
  projectHasPage,
  resolveSlugs,
} from "@/lib/content";
import { buildMetadata, entryOgImage } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSolutionPages().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const solution = getSolutionPage((await params).slug);
  if (!solution) return {};
  const path = `/solutions/${solution.slug}`;
  return buildMetadata({ ...solution.seo, path, image: entryOgImage(path, "U Design Solutions") });
}

export default async function SolutionPage({ params }: Props) {
  const solution = getSolutionPage((await params).slug);
  if (!solution) notFound();
  return (
    <SolutionTemplate
      solution={solution}
      industries={resolveSlugs(solution.industries, getIndustries())}
      projects={resolveSlugs(solution.projects, getProjects())}
      projectHref={(p) => (projectHasPage(p) ? `/portfolio/${p.slug}` : undefined)}
    />
  );
}

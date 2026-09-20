import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectTemplate } from "@/components/templates/ProjectTemplate";
import { getIndustry, getProjectPages, getSolutions, resolveSlugs } from "@/lib/content";
import { buildMetadata, entryOgImage } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectPages().map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  return getProjectPages().find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project?.seo) return {};
  const path = `/portfolio/${project.slug}`;
  return buildMetadata({ ...project.seo, path, image: entryOgImage(path, "U Design Portfolio") });
}

export default async function ProjectPage({ params }: Props) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return (
    <div
      data-track-view="portfolio_view"
      data-track-project={project.slug}
      data-track-type={project.type}
    >
      <ProjectTemplate
        project={project}
        industry={getIndustry(project.industry)}
        solutions={resolveSlugs(project.solutionTypes, getSolutions())}
      />
    </div>
  );
}

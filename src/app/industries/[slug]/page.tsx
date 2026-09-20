import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryTemplate } from "@/components/templates/IndustryTemplate";
import {
  getIndustryPage,
  getIndustryPages,
  getProjects,
  getSolutions,
  resolveSlugs,
} from "@/lib/content";
import { buildMetadata, entryOgImage } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndustryPages().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getIndustryPage((await params).slug);
  if (!industry) return {};
  const path = `/industries/${industry.slug}`;
  return buildMetadata({ ...industry.seo, path, image: entryOgImage(path, "U Design Industries") });
}

export default async function IndustryPage({ params }: Props) {
  const industry = getIndustryPage((await params).slug);
  if (!industry) notFound();
  return (
    <IndustryTemplate
      industry={industry}
      solutions={resolveSlugs(industry.solutions, getSolutions())}
      projects={resolveSlugs(industry.projects, getProjects())}
    />
  );
}

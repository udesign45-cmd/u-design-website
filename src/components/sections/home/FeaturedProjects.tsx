import Link from "@/components/ui/AppLink";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getFeaturedProjects, getIndustry, projectHasPage } from "@/lib/content";

/** Software showcase (spec FR-015). Concept projects are always labelled. */
export function FeaturedProjects() {
  const projects = getFeaturedProjects();
  if (projects.length === 0) return null;
  return (
    <Section surface="white" id="projects" labelledBy="projects-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="projects-heading"
          level={2}
          eyebrow={home.projects.eyebrow}
          title={home.projects.heading}
          intro={home.projects.intro}
        />
        <Link href="/portfolio" className="shrink-0 font-semibold link-inline">
          {home.projects.allLink}
        </Link>
      </div>
      <ul className="motion-reveal mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const industry = getIndustry(project.industry);
          return (
            <li key={project.slug}>
              <PortfolioCard
                project={project}
                industryName={industry?.name ?? ""}
                industryIcon={industry?.icon ?? "layers"}
                href={projectHasPage(project) ? `/portfolio/${project.slug}` : undefined}
                showModules
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

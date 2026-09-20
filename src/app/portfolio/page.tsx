import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Section } from "@/components/layout/Section";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import {
  getIndustries,
  getIndustry,
  getProjects,
  getSolutions,
  projectHasPage,
} from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.portfolio, path: "/portfolio" });

/** Portfolio listing with type labels (spec FR-050, FR-052). */
export default function PortfolioPage() {
  const projects = getProjects();
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Portfolio", path: "/portfolio" }])}
        eyebrow="Portfolio"
        title="Business systems designed around real workflows"
        intro="Each project shows the business problem, how the system solves it, its key features and how it is applied. Concept projects are clearly labelled as Concept / Demo."
      />
      <Section surface="gray" id="projects" labelledBy="projects-heading">
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>
        <PortfolioFilter
          listId="project-list"
          items={projects.map((p) => ({ industry: p.industry, solutions: p.solutionTypes }))}
          industries={getIndustries().map((i) => ({ value: i.slug, label: i.name }))}
          solutions={getSolutions().map((s) => ({ value: s.slug, label: s.name }))}
        />
        <ul id="project-list" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const industry = getIndustry(project.industry);
            return (
              <li
                key={project.slug}
                data-industry={project.industry}
                data-solutions={project.solutionTypes.join(" ")}
              >
                <PortfolioCard
                  project={project}
                  industryName={industry?.name ?? ""}
                  industryIcon={industry?.icon ?? "layers"}
                  href={projectHasPage(project) ? `/portfolio/${project.slug}` : undefined}
                  headingLevel={3}
                  showModules
                />
              </li>
            );
          })}
        </ul>
      </Section>
      <CtaBanner
        title="Need a system designed for your business?"
        text="Tell us about your operation. We will explain how we would approach it and what a first version could include."
        context={{ source: "/portfolio" }}
        secondary={{ label: "View Our Solutions", href: "/solutions" }}
      />
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Portfolio", path: "/portfolio" }]))} />
    </>
  );
}

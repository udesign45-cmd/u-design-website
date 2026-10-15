import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Section, type Surface } from "@/components/layout/Section";
import { MediaGallery } from "@/components/portfolio/MediaGallery";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { ProjectTypeBadge } from "@/components/portfolio/ProjectTypeBadge";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionImages } from "@/lib/content/images";
import {
  getCreativeCategories,
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

const surfaces: Surface[] = ["gray", "white"];

/** Portfolio: creative work galleries, then software projects with type labels (spec FR-050, FR-052). */
export default function PortfolioPage() {
  const projects = getProjects();
  const categories = getCreativeCategories();
  const sections = [
    ...categories.map((c) => ({ id: c.slug, name: c.name, count: c.items.length })),
    { id: "projects", name: "Business software", count: projects.length },
  ];
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Portfolio", path: "/portfolio" }])}
        eyebrow="Portfolio"
        title="Creative work and business systems we have built"
        intro="Social media design, AI product photography, video ads and logo animation from our marketing team, alongside software concepts that show how we design business systems."
        image={sectionImages.marketingAnalytics}
      />
      <Section
        spacing="none"
        className="z-20 border-b border-line md:sticky md:top-(--header-height) md:bg-white/95 md:backdrop-blur"
      >
        <nav aria-label="Portfolio sections" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <ul className="flex gap-2 py-3 whitespace-nowrap">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-white px-4 text-small font-medium transition-colors hover:border-brand-green-dark hover:bg-brand-green/10"
                >
                  {s.name}
                  <span className="rounded-pill bg-surface-gray px-2 py-0.5 text-micro text-ink-muted tabular-nums">
                    {s.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {categories.map((category, i) => (
        <Section
          key={category.slug}
          surface={surfaces[i % 2]}
          id={category.slug}
          labelledBy={`${category.slug}-heading`}
          className="scroll-mt-20"
        >
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              level={2}
              id={`${category.slug}-heading`}
              title={category.name}
              intro={category.intro}
            />
            {category.concept ? (
              <div className="shrink-0">
                <ProjectTypeBadge type="concept" />
              </div>
            ) : null}
          </div>
          <MediaGallery name={category.name} aspect={category.aspect} items={category.items} />
        </Section>
      ))}

      <Section
        surface={surfaces[categories.length % 2]}
        id="projects"
        labelledBy="projects-heading"
        className="scroll-mt-20"
      >
        <SectionHeading
          level={2}
          id="projects-heading"
          title="Business software"
          intro="Systems designed around real workflows. Each one shows the business problem, how the system solves it and its key modules. Concept projects are clearly labelled as Concept / Demo."
          className="mb-8 md:mb-10"
        />
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
        title="Want work like this for your business?"
        text="Tell us what you need, whether it is a campaign, creative for your social channels or a business system. We will explain how we would approach it."
        context={{ source: "/portfolio" }}
        secondary={{ label: "View Our Solutions", href: "/solutions" }}
      />
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Portfolio", path: "/portfolio" }]))} />
    </>
  );
}

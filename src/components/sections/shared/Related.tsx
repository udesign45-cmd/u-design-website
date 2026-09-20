import Link from "@/components/ui/AppLink";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Section, type Surface } from "@/components/layout/Section";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustry, projectHasPage } from "@/lib/content";
import type { Project } from "@/types/content";

type RelatedLink = { name: string; href: string; summary?: string };

/** Related industries or solutions; renders nothing when empty (internal linking, FR-031/041). */
export function RelatedLinks({
  id,
  heading,
  intro,
  links,
  surface = "white",
}: {
  id: string;
  heading: string;
  intro?: string;
  links: RelatedLink[];
  surface?: Surface;
}) {
  if (links.length === 0) return null;
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} level={2} title={heading} intro={intro} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Card variant="link" className="h-full">
              <h3 className="text-h4">
                <Link href={link.href} className={stretchedLink}>
                  {link.name}
                </Link>
              </h3>
              {link.summary ? <p className="mt-2 text-ink-muted">{link.summary}</p> : null}
              <span
                aria-hidden="true"
                className="mt-auto inline-flex items-center gap-1 pt-4 text-small font-semibold"
              >
                Learn more <Icon name="arrow-right" size={16} className="text-brand-green-dark" />
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Related projects; optionally falls back to a portfolio link when empty (US3 scenario 4). */
export function RelatedProjects({
  id = "related-projects",
  heading = "Related projects",
  projects,
  fallbackToPortfolio = false,
  surface = "gray",
}: {
  id?: string;
  heading?: string;
  projects: Project[];
  fallbackToPortfolio?: boolean;
  surface?: Surface;
}) {
  if (projects.length === 0) {
    if (!fallbackToPortfolio) return null;
    return (
      <Section surface={surface} id={id} labelledBy={`${id}-heading`} spacing="compact">
        <SectionHeading id={`${id}-heading`} level={2} title={heading} />
        <p className="mt-4 max-w-2xl text-lead text-fg-muted">
          We are adding projects for this industry. In the meantime, our portfolio shows how we
          approach business systems across sectors.
        </p>
        <Link href="/portfolio" className="mt-5 inline-block font-semibold link-inline">
          Browse our portfolio
        </Link>
      </Section>
    );
  }
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} level={2} title={heading} />
      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const industry = getIndustry(project.industry);
          return (
            <li key={project.slug}>
              <PortfolioCard
                project={project}
                industryName={industry?.name ?? ""}
                industryIcon={industry?.icon ?? "layers"}
                href={projectHasPage(project) ? `/portfolio/${project.slug}` : undefined}
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

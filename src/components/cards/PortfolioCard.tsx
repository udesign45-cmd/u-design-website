import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { ProjectTypeBadge } from "@/components/portfolio/ProjectTypeBadge";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Project } from "@/types/content";

type PortfolioCardProps = {
  project: Project;
  industryName: string;
  industryIcon: IconName;
  href?: string;
  showModules?: boolean;
  headingLevel?: 2 | 3;
};

const barSets = [
  ["h-2/5", "h-3/5", "h-1/2", "h-4/5", "h-3/5", "h-full", "h-3/4"],
  ["h-3/4", "h-1/2", "h-2/3", "h-2/5", "h-4/5", "h-3/5", "h-full"],
  ["h-1/2", "h-2/3", "h-full", "h-3/5", "h-3/4", "h-2/5", "h-4/5"],
];

function barsFor(slug: string) {
  const index = [...slug].reduce((sum, c) => sum + c.charCodeAt(0), 0) % barSets.length;
  return barSets[index] ?? barSets[0]!;
}

/** Project tile with type badge; links to the case study only when a page exists. */
export function PortfolioCard({
  project,
  industryName,
  industryIcon,
  href,
  showModules = false,
  headingLevel = 3,
}: PortfolioCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Card variant={href ? "link" : "default"} className="h-full overflow-hidden p-0" as="article">
      <div
        className="relative aspect-16/10 overflow-hidden rounded-t-card surface-deep"
        data-industry={project.industry}
        data-solutions={project.solutionTypes.join(" ")}
      >
        {project.cover && !project.cover.isPlaceholder ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 92vw"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex gap-3 p-5">
            <div className="flex w-1/3 flex-col gap-2 rounded-control bg-white/10 p-3">
              <span className="mb-1 inline-flex size-8 items-center justify-center rounded-control bg-brand-green text-ink">
                <Icon name={industryIcon} size={16} />
              </span>
              {project.modules.slice(0, 5).map((m, i) => (
                <span
                  key={m.name}
                  className={
                    i === 0 ? "h-2 rounded-pill bg-brand-green" : "h-2 rounded-pill bg-white/25"
                  }
                />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="h-10 rounded-control bg-white/90" />
                <span className="h-10 rounded-control bg-white/90" />
                <span className="h-10 rounded-control bg-white/90" />
              </div>
              <div className="flex flex-1 items-end gap-1.5 rounded-control bg-white p-3">
                {barsFor(project.slug).map((h, i) => (
                  <span key={i} className={`rounded-t-sm flex-1 bg-brand-green-dark/80 ${h}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectTypeBadge type={project.type} />
          <span className="text-small text-ink-muted">{project.industryLabel ?? industryName}</span>
        </div>
        <Heading className="mt-3 text-h4">
          {href ? (
            <Link href={href} className={stretchedLink}>
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </Heading>
        <p className="mt-2 text-ink-muted">{project.summary}</p>
        {showModules ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} modules`}>
            {project.modules.map((m) => (
              <li
                key={m.name}
                className="inline-flex items-center gap-1 rounded-pill border border-line px-2.5 py-0.5 text-small"
              >
                <Icon name="check" size={14} className="text-brand-green-dark" />
                {m.name}
              </li>
            ))}
          </ul>
        ) : null}
        {href ? (
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-1 pt-5 text-small font-semibold"
          >
            View Case Study <Icon name="arrow-right" size={16} className="text-brand-green-dark" />
          </span>
        ) : null}
      </div>
    </Card>
  );
}

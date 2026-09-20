import Link from "@/components/ui/AppLink";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/layout/Section";
import { ProjectTypeBadge } from "@/components/portfolio/ProjectTypeBadge";
import { ScreenshotGallery } from "@/components/portfolio/ScreenshotGallery";
import { FeatureGrid } from "@/components/sections/shared/ContentBlocks";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { RelatedLinks } from "@/components/sections/shared/Related";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import type { Industry, Project, Solution } from "@/types/content";

type ProjectTemplateProps = {
  project: Project;
  industry?: Industry;
  solutions: Solution[];
};

function Narrative({
  id,
  eyebrow,
  heading,
  body,
  surface,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  body?: string[];
  surface: "white" | "gray";
}) {
  if (!body?.length) return null;
  return (
    <Section surface={surface} id={id} labelledBy={`${id}-heading`}>
      <div className="grid gap-8 lg:grid-cols-3">
        <SectionHeading id={`${id}-heading`} level={2} eyebrow={eyebrow} title={heading} />
        <div className="grid gap-4 text-lead text-fg-muted lg:col-span-2">
          {body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Case study: Problem → Solution → Features → Screenshots → Business application (spec FR-051). */
export function ProjectTemplate({ project, industry, solutions }: ProjectTemplateProps) {
  const path = `/portfolio/${project.slug}`;
  const isClient = project.type === "client";

  return (
    <>
      <Section surface="deep" spacing="compact" className="pt-8 md:pt-10">
        <Breadcrumbs
          trail={buildTrail([
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path },
          ])}
        />
        <div className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <ProjectTypeBadge type={project.type} />
            <span className="text-small text-fg-muted">
              {project.industryLabel ?? industry?.name}
            </span>
          </div>
          <h1 className="mt-4 text-h1">{project.title}</h1>
          <p className="mt-5 text-lead text-fg-muted">{project.summary}</p>
          {solutions.length ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Solution types">
              {solutions.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="inline-flex min-h-9 items-center rounded-pill border border-white/25 px-3 text-small hover:border-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {!isClient ? (
            <p className="mt-6 max-w-2xl text-small text-fg-muted">
              This is a concept project created by U Design to demonstrate our approach. It does not
              represent a specific client.
            </p>
          ) : null}
        </div>
      </Section>

      <Narrative
        id="challenge"
        eyebrow="Problem"
        heading="The challenge"
        body={project.challenge}
        surface="white"
      />
      <Narrative
        id="solution"
        eyebrow="Solution"
        heading="The solution"
        body={project.solution}
        surface="gray"
      />

      <FeatureGrid
        id="features"
        eyebrow="Features"
        surface="white"
        heading="Key features"
        items={project.modules.map((m) => ({ title: m.name, description: m.description }))}
      />

      <Section surface="gray" id="screenshots" labelledBy="screenshots-heading">
        <SectionHeading
          id="screenshots-heading"
          level={2}
          eyebrow="Product interface"
          title="Screens"
        />
        <div className="mt-10">
          <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
        </div>
      </Section>

      <Narrative
        id="business-application"
        eyebrow="Business application"
        heading="How businesses use it"
        body={project.businessApplication}
        surface="white"
      />

      {project.technologies?.length ? (
        <Section
          surface="white"
          spacing="compact"
          id="technologies"
          labelledBy="technologies-heading"
        >
          <h2 id="technologies-heading" className="text-h4">
            Technologies
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li
                key={t}
                className="rounded-pill bg-surface-gray px-3 py-1 text-small text-ink-muted"
              >
                {t}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {project.type === "client" && project.results?.length ? (
        <Section surface="ink" id="results" labelledBy="results-heading">
          <SectionHeading id="results-heading" level={2} title="Results" />
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {project.results.map((r) => (
              <div key={r.label}>
                <dt className="text-fg-muted">{r.label}</dt>
                <dd className="font-heading text-h2 font-bold text-brand-green">{r.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      <RelatedLinks
        id="related"
        heading="Related industry and solutions"
        surface="gray"
        links={[
          ...(industry
            ? [
                {
                  name: industry.name,
                  href: `/industries/${industry.slug}`,
                  summary: industry.summary,
                },
              ]
            : []),
          ...solutions.map((s) => ({
            name: s.name,
            href: `/solutions/${s.slug}`,
            summary: s.summary,
          })),
        ]}
      />

      <CtaBanner
        title="Need a system like this for your business?"
        text="Every business works differently. Tell us about your workflow and we will suggest how a system could be designed around it."
        context={{ industry: industry?.slug, source: path }}
        secondary={{
          label: "Discuss Your Business",
          href: `/contact?source=${encodeURIComponent(path)}#consultation`,
        }}
      />
      <JsonLd
        data={breadcrumbList(
          buildTrail([
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path },
          ]),
        )}
      />
    </>
  );
}

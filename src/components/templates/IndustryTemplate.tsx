import {
  BenefitList,
  ChallengeList,
  FeatureGrid,
  WorkflowList,
} from "@/components/sections/shared/ContentBlocks";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { RelatedLinks, RelatedProjects } from "@/components/sections/shared/Related";
import { Icon } from "@/components/ui/Icon";
import { consultationHref } from "@/lib/cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import type { IndustryPage, Project, Solution } from "@/types/content";

type IndustryTemplateProps = {
  industry: IndustryPage;
  solutions: Solution[];
  projects: Project[];
};

/**
 * Industry page (spec FR-041): challenges → workflows → solutions → features →
 * benefits → related projects → consultation CTA.
 */
export function IndustryTemplate({ industry, solutions, projects }: IndustryTemplateProps) {
  const path = `/industries/${industry.slug}`;
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([
          { name: "Industries", path: "/industries" },
          { name: industry.name, path },
        ])}
        eyebrow={`${industry.name} industry`}
        title={industry.hero.heading}
        intro={industry.hero.intro}
        primaryCta={{
          label: "Get Free Consultation",
          href: consultationHref({ industry: industry.slug, source: path }),
        }}
        secondaryCta={{ label: "View Our Solutions", href: "/solutions" }}
        aside={
          <div className="rounded-panel border border-white/15 bg-white/5 p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-control bg-brand-green text-ink">
                <Icon name={industry.icon} size={22} />
              </span>
              <p className="font-semibold text-white">Workflows we connect</p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {industry.shortWorkflows.map((w) => (
                <li
                  key={w}
                  className="rounded-pill border border-white/20 px-3 py-1 text-small text-white"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <ChallengeList
        id="challenges"
        eyebrow="Common challenges"
        heading={`Where ${industry.name.toLowerCase()} businesses lose time and visibility`}
        items={industry.challenges}
      />

      <WorkflowList
        id="workflows"
        eyebrow="Workflows"
        heading="The workflows your system should connect"
        intro="Each workflow is designed around the way your team already works, then connected so information flows between departments."
        items={industry.workflows}
      />

      <RelatedLinks
        id="solutions"
        heading="Suitable software solutions"
        intro="The solutions most often combined for this industry."
        links={solutions.map((s) => ({
          name: s.name,
          href: `/solutions/${s.slug}`,
          summary: s.summary,
        }))}
      />

      <FeatureGrid
        id="features"
        eyebrow="Features"
        heading="Important features"
        items={industry.features}
      />

      <BenefitList
        id="benefits"
        eyebrow="Business benefits"
        heading="What changes for your business"
        items={industry.benefits}
      />

      <RelatedProjects projects={projects} heading="Related projects" fallbackToPortfolio />

      <CtaBanner
        title={`Let's discuss your ${industry.name.toLowerCase()} workflow`}
        text="Tell us how your operation runs today. We will suggest a practical system designed around your processes."
        context={{ industry: industry.slug, source: path }}
      />
      <JsonLd
        data={breadcrumbList(
          buildTrail([
            { name: "Industries", path: "/industries" },
            { name: industry.name, path },
          ]),
        )}
      />
    </>
  );
}

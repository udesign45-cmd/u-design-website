import { ProcessSteps } from "@/components/cards/ProcessStep";
import { Section } from "@/components/layout/Section";
import {
  BenefitList,
  ChallengeList,
  FeatureGrid,
  ProseBlock,
} from "@/components/sections/shared/ContentBlocks";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { FaqList } from "@/components/sections/shared/FaqList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { RelatedLinks, RelatedProjects } from "@/components/sections/shared/Related";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/process";
import { consultationHref } from "@/lib/cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList, faqPage, service as serviceLd } from "@/lib/seo/jsonld";
import type { Industry, Project, SolutionPage } from "@/types/content";

type SolutionTemplateProps = {
  solution: SolutionPage;
  industries: Industry[];
  projects: Project[];
  projectHref: (project: Project) => string | undefined;
};

/** Solution page: problem → approach → features → benefits → proof → CTA (spec FR-031, FR-032). */
export function SolutionTemplate({
  solution,
  industries,
  projects,
  projectHref,
}: SolutionTemplateProps) {
  const path = `/solutions/${solution.slug}`;
  const caseStudy = projects.map(projectHref).find(Boolean);

  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([
          { name: "Solutions", path: "/solutions" },
          { name: solution.name, path },
        ])}
        eyebrow={solution.name}
        title={solution.hero.heading}
        intro={solution.hero.intro}
        primaryCta={{
          label: "Get Free Consultation",
          href: consultationHref({ need: solution.slug, source: path }),
        }}
        secondaryCta={caseStudy ? { label: "View Case Study", href: caseStudy } : undefined}
        aside={
          <div className="rounded-panel border border-white/15 bg-white/5 p-6 lg:p-8">
            <p className="text-small font-semibold text-white">Typical uses</p>
            <ul className="mt-4 grid gap-3">
              {solution.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <ChallengeList
        id="problem"
        eyebrow="The challenge"
        heading={solution.problem.heading}
        items={solution.problem.points}
      />

      <ProseBlock
        id="approach"
        eyebrow="Our approach"
        surface="gray"
        heading={solution.approach.heading}
        body={solution.approach.body}
      />

      <FeatureGrid
        id="features"
        eyebrow="Features"
        surface="white"
        heading="What the solution includes"
        items={solution.features}
      />

      <BenefitList
        id="benefits"
        eyebrow="Business benefits"
        surface="ink"
        heading="What changes for your business"
        items={solution.benefits}
      />

      <RelatedLinks
        id="industries"
        heading="Industries we build this for"
        intro="Every implementation is adapted to the workflows of your sector."
        links={industries.map((i) => ({
          name: i.name,
          href: `/industries/${i.slug}`,
          summary: i.summary,
        }))}
      />

      <RelatedProjects projects={projects} heading="Related projects" />

      <Section surface="white" id="process" labelledBy="process-heading">
        <SectionHeading
          id="process-heading"
          level={2}
          eyebrow="How we work"
          title="From discovery to growth"
        />
        <div className="mt-10">
          <ProcessSteps steps={processSteps} compact />
        </div>
      </Section>

      {solution.faqs?.length ? <FaqList faqs={solution.faqs} /> : null}

      <CtaBanner
        title={`Discuss ${solution.name} for your business`}
        text="Tell us how your team works today. We will outline a practical approach and next steps in a free consultation."
        context={{ need: solution.slug, source: path }}
        secondary={{ label: "View Our Solutions", href: "/solutions" }}
      />
      <JsonLd
        data={serviceLd({ name: solution.name, description: solution.seo.description, path })}
      />
      <JsonLd
        data={breadcrumbList(
          buildTrail([
            { name: "Solutions", path: "/solutions" },
            { name: solution.name, path },
          ]),
        )}
      />
      {solution.faqs?.length ? <JsonLd data={faqPage(solution.faqs)} /> : null}
    </>
  );
}

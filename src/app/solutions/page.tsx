import { CapabilityRow } from "@/components/cards/CapabilityRow";
import { ProcessSteps } from "@/components/cards/ProcessStep";
import { Section } from "@/components/layout/Section";
import { ScrollStagger } from "@/components/motion/ScrollStagger";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { SoftwareShowcase } from "@/components/visuals/DashboardPreview";
import { sectionImages } from "@/lib/content/images";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/process";
import { getSolutions, hasPage } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.solutions, path: "/solutions" });

/** Solutions hub (spec FR-030). */
export default function SolutionsPage() {
  const solutions = getSolutions();
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Solutions", path: "/solutions" }])}
        eyebrow="Business Software & Digital Solutions"
        title="Software built around how your business works"
        intro="We design and build business systems that replace spreadsheets, manual steps and disconnected tools with one clear way of working."
        image={sectionImages.corporateTechnology}
      />

      <Section surface="white" id="solutions" labelledBy="solutions-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <SectionHeading
            id="solutions-heading"
            level={2}
            title="Our software solutions"
            intro="Each solution is custom-built for your processes, and they can be combined as your business grows."
            className="lg:col-span-5"
          />
          <SoftwareShowcase className="lg:col-span-7" />
        </div>
        <ScrollStagger as="ol" className="mt-14 lg:mt-16">
          {solutions.map((s, i) => (
            <CapabilityRow
              key={s.slug}
              index={i + 1}
              name={s.name}
              benefit={s.summary}
              href={hasPage(s) ? `/solutions/${s.slug}` : undefined}
            />
          ))}
        </ScrollStagger>
      </Section>

      <Section surface="gray" id="process" labelledBy="process-heading">
        <SectionHeading
          id="process-heading"
          level={2}
          eyebrow="How we work"
          title="A clear process from first conversation to launch"
        />
        <div className="mt-10">
          <ProcessSteps steps={processSteps} compact />
        </div>
      </Section>

      <CtaBanner
        title="Not sure which solution you need?"
        text="Describe the problem you want to solve. We will recommend the right combination of software for your business."
        context={{ need: "not-sure", source: "/solutions" }}
      />
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Solutions", path: "/solutions" }]))} />
    </>
  );
}

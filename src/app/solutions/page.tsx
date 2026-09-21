import { ServiceCard } from "@/components/cards/ServiceCard";
import { ProcessSteps } from "@/components/cards/ProcessStep";
import { Section } from "@/components/layout/Section";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
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
        <SectionHeading
          id="solutions-heading"
          level={2}
          title="Our software solutions"
          intro="Each solution is custom-built for your processes, and they can be combined as your business grows."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.slug}>
              <ServiceCard
                name={s.name}
                benefit={s.summary}
                icon={s.icon}
                href={hasPage(s) ? `/solutions/${s.slug}` : undefined}
              />
            </li>
          ))}
        </ul>
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

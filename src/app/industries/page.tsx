import { IndustryCard } from "@/components/cards/IndustryCard";
import { Section } from "@/components/layout/Section";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustries, hasPage } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.industries, path: "/industries" });

/** Industries hub with Manufacturing first (spec FR-040, FR-043). */
export default function IndustriesPage() {
  const [featured, ...rest] = getIndustries();
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Industries", path: "/industries" }])}
        eyebrow="Industries"
        title="Solutions shaped around your industry"
        intro="Every sector has its own workflows, documents and reports. We learn how your industry works and design systems that fit it."
      />

      <Section surface="gray" id="industries" labelledBy="industries-heading">
        <SectionHeading
          id="industries-heading"
          level={2}
          title="Industries we work with"
          intro="Choose your industry to see common challenges, the workflows we connect and the solutions that fit."
        />
        {featured ? (
          <div className="mt-10">
            <IndustryCard
              industry={featured}
              feature
              href={hasPage(featured) ? `/industries/${featured.slug}` : undefined}
            />
          </div>
        ) : null}
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((industry) => (
            <li key={industry.slug}>
              <IndustryCard
                industry={industry}
                href={hasPage(industry) ? `/industries/${industry.slug}` : undefined}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="white" id="other" labelledBy="other-heading" spacing="compact">
        <div className="max-w-3xl">
          <h2 id="other-heading" className="text-h3">
            Another industry?
          </h2>
          <p className="mt-3 text-lead text-ink-muted">
            Our solutions are adapted to your specific workflow, whatever your sector. If your
            industry is not listed, tell us how your business works and we will explain how we would
            approach it.
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Tell us about your industry"
        text="Share how your operation runs today and where the delays are. We will suggest a practical way forward."
        context={{ industry: "other", source: "/industries" }}
      />
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Industries", path: "/industries" }]))} />
    </>
  );
}

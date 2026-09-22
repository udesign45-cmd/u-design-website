import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/shared/PageHero";
import { PlanExplorer } from "@/components/plans/PlanExplorer";
import { getPlannableServices } from "@/lib/content/plans";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.plans, path: "/plans" });

/** Pick a service, compare Basic / Standard / Premium scope, then get started. */
export default function PlansPage() {
  const services = getPlannableServices();

  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Plans", path: "/plans" }])}
        eyebrow="Choose the Plan"
        title="Pick a service, compare the scope, get started"
        intro="Choose a service below to see it broken into Basic, Standard and Premium scope. There's no fixed price list here — the plan is the starting point for a conversation about your business."
        primaryCta={null}
      />
      <Section surface="white" id="plans" labelledBy="plans-heading">
        <h2 id="plans-heading" className="sr-only">
          Compare plans by service
        </h2>
        <PlanExplorer services={services} />
      </Section>
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Plans", path: "/plans" }]))} />
    </>
  );
}

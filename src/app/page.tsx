import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { CredibilityMetrics } from "@/components/sections/home/CredibilityMetrics";
import { DigitalizationJourney } from "@/components/sections/home/DigitalizationJourney";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { Hero } from "@/components/sections/home/Hero";
import { HowWeWork } from "@/components/sections/home/HowWeWork";
import { IndustriesGrid } from "@/components/sections/home/IndustriesGrid";
import { MarketingOverview } from "@/components/sections/home/MarketingOverview";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { TrustLogos } from "@/components/sections/home/TrustLogos";
import { WhyUDesign } from "@/components/sections/home/WhyUDesign";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { website } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({ ...pageSeo.home, absoluteTitle: true, path: "/" });

/** Home page in the approved section order (spec FR-010–FR-020). Header and footer come from the layout. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustLogos />
      <ServicesOverview />
      <IndustriesGrid />
      <FeaturedProjects />
      <DigitalizationJourney />
      <HowWeWork />
      <MarketingOverview />
      <WhyUDesign />
      <CredibilityMetrics />
      <Testimonials />
      <FinalCta />
      <JsonLd data={website(site)} />
    </>
  );
}

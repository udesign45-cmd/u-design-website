import Link from "@/components/ui/AppLink";
import { CapabilityRow } from "@/components/cards/CapabilityRow";
import { Section } from "@/components/layout/Section";
import { ScrollStagger } from "@/components/motion/ScrollStagger";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { MarketingShowcase } from "@/components/visuals/DashboardPreview";
import { sectionImages } from "@/lib/content/images";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getMarketingServices, hasPage } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList, service } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.digitalMarketing, path: "/digital-marketing" });

/** Digital Marketing hub (spec FR-060, FR-061). Outcomes, never guarantees. */
export default function DigitalMarketingPage() {
  const services = getMarketingServices();
  const strategy = services.find((s) => s.slug === "digital-strategy");
  const covered = services.flatMap((service) =>
    service.covers.map((c) => ({
      ...c,
      icon: service.icon,
      href: hasPage(service) ? `/digital-marketing/${service.slug}` : undefined,
    })),
  );

  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Digital Marketing", path: "/digital-marketing" }])}
        eyebrow="Digital Marketing & Growth"
        title={home.marketing.heading}
        intro="We help businesses improve their digital presence, reach the right audience and turn attention into enquiries, with marketing that is planned, measured and connected to your sales process."
        secondaryCta={{ label: "View Our Solutions", href: "/solutions" }}
        image={sectionImages.corporateTeam}
      />

      <Section surface="white" id="services" labelledBy="services-heading">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <SectionHeading
            id="services-heading"
            level={2}
            title="Our digital marketing services"
            intro="Choose the services you need, or combine them into one coordinated plan."
            className="lg:col-span-5"
          />
          <MarketingShowcase
            image={sectionImages.marketingAnalytics}
            className="lg:col-span-7"
          />
        </div>
        <ScrollStagger as="ol" className="mt-14 lg:mt-16">
          {covered.map((c, i) => (
            <CapabilityRow
              key={c.name}
              index={i + 1}
              name={c.name}
              benefit={c.benefit}
              href={c.href}
              headingLevel={3}
            />
          ))}
        </ScrollStagger>
      </Section>

      {strategy ? (
        <Section surface="gray" id="strategy" labelledBy="strategy-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              id="strategy-heading"
              level={2}
              eyebrow="Digital strategy"
              title="Start with a plan"
              intro={strategy.summary}
            />
            <ul className="grid gap-3">
              {[
                "Business goals and target audience",
                "The right channels for your market",
                "A roadmap connecting marketing to your business systems",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-card border border-line bg-white p-5"
                >
                  <Icon
                    name="compass"
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-green-dark"
                  />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section surface="ink" id="connected" labelledBy="connected-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            id="connected-heading"
            level={2}
            eyebrow="Build. Market. Grow."
            title="Marketing and software under one roof"
            intro="The same team that builds your CRM and dashboards runs your campaigns, so enquiries are captured, followed up and measured in one connected system."
          />
          <div className="grid gap-3">
            <p className="text-lead text-fg-muted">
              Reach the right audience, build brand visibility and generate leads, then see which
              activity is actually bringing in business.
            </p>
            <Link
              href="/solutions/crm"
              className="inline-flex items-center gap-2 font-semibold text-brand-green hover:underline"
            >
              See how our CRM connects to your marketing <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Grow your business with a clear marketing plan"
        text="Tell us about your market and your goals. We will suggest where to focus first in a free consultation."
        context={{ source: "/digital-marketing" }}
        secondary={{ label: "Grow Your Business", href: "#services" }}
      />
      {/* Umbrella Service plus breadcrumbs (contracts/routes-and-seo.md). */}
      <JsonLd
        data={service({
          name: "Digital Marketing",
          description: pageSeo.digitalMarketing.description,
          path: "/digital-marketing",
        })}
      />
      <JsonLd
        data={breadcrumbList(
          buildTrail([{ name: "Digital Marketing", path: "/digital-marketing" }]),
        )}
      />
    </>
  );
}

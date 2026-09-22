import Link from "@/components/ui/AppLink";
import { Section } from "@/components/layout/Section";
import {
  BenefitList,
  ChallengeList,
  FeatureGrid,
} from "@/components/sections/shared/ContentBlocks";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { FaqList } from "@/components/sections/shared/FaqList";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { consultationHref } from "@/lib/cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList, faqPage, service as serviceLd } from "@/lib/seo/jsonld";
import { sectionImages } from "@/lib/content/images";
import type { MarketingServicePage } from "@/types/content";

/** Marketing service page (spec FR-060, FR-061): outcomes, never guarantees. */
export function MarketingServiceTemplate({ service }: { service: MarketingServicePage }) {
  const path = `/digital-marketing/${service.slug}`;
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([
          { name: "Digital Marketing", path: "/digital-marketing" },
          { name: service.name, path },
        ])}
        eyebrow="Digital marketing"
        title={service.hero.heading}
        intro={service.hero.intro}
        primaryCta={{
          label: "Get Free Consultation",
          href: consultationHref({ need: service.slug, source: path }),
        }}
        secondaryCta={{ label: "Grow Your Business", href: "/digital-marketing" }}
        image={sectionImages.marketingAnalytics}
        aside={
          <div className="rounded-panel border border-white/15 bg-white/5 p-6 lg:p-8">
            <p className="text-small font-semibold text-white">What is included</p>
            <ul className="mt-4 grid gap-4">
              {service.covers.map((c) => (
                <li key={c.name}>
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <Icon name="check" size={18} className="text-brand-green" />
                    {c.name}
                  </p>
                  <p className="mt-1 pl-7 text-small text-fg-muted">{c.benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <ChallengeList
        id="problem"
        eyebrow="The challenge"
        heading={service.problem.heading}
        items={service.problem.points}
      />

      <FeatureGrid
        id="what-we-do"
        eyebrow={service.approach.heading}
        surface="gray"
        heading="What we do"
        intro={service.approach.body[0]}
        items={service.features}
      />

      <BenefitList
        id="outcomes"
        eyebrow="Outcomes"
        surface="ink"
        heading="What it means for your business"
        items={service.outcomes}
      />

      <Section surface="white" id="connected" labelledBy="connected-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            id="connected-heading"
            level={2}
            eyebrow="Build. Market. Grow."
            title="Marketing connected to your business systems"
            intro="Because we also build business software, enquiries from campaigns can flow straight into your CRM and your reports, so marketing and sales work from the same information."
          />
          <ul className="grid gap-3">
            {service.benefits.map((b) => (
              <li
                key={b.title}
                className="flex items-start gap-3 rounded-card border border-line p-5"
              >
                <Icon name="check" size={18} className="mt-1 shrink-0 text-brand-green-dark" />
                <span>
                  <span className="block font-semibold">{b.title}</span>
                  <span className="text-ink-muted">{b.description}</span>
                </span>
              </li>
            ))}
            <li>
              <Link href="/solutions" className="font-semibold link-inline">
                View our software solutions
              </Link>
            </li>
          </ul>
        </div>
      </Section>

      {service.faqs?.length ? <FaqList faqs={service.faqs} /> : null}

      <CtaBanner
        title={`Plan your ${service.name} with us`}
        text="Tell us about your market, audience and goals. We will suggest a practical plan in a free consultation."
        context={{ need: service.slug, source: path }}
        secondary={{ label: "Grow Your Business", href: "/digital-marketing" }}
      />
      <JsonLd
        data={serviceLd({ name: service.name, description: service.seo.description, path })}
      />
      <JsonLd
        data={breadcrumbList(
          buildTrail([
            { name: "Digital Marketing", path: "/digital-marketing" },
            { name: service.name, path },
          ]),
        )}
      />
      {service.faqs?.length ? <JsonLd data={faqPage(service.faqs)} /> : null}
    </>
  );
}

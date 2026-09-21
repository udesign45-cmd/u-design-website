import Link from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarketingShowcase, SoftwareShowcase } from "@/components/visuals/DashboardPreview";
import { home } from "@/content/home";
import { getMarketingServices, getSolutions, hasPage } from "@/lib/content";
import { sectionImages } from "@/lib/content/images";

type Row = { name: string; benefit: string; href?: string };

/** One row of a numbered editorial capability list (not a card grid). */
function CapabilityRow({ index, name, benefit, href }: Row & { index: number }) {
  return (
    <li className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1 border-t border-line py-5 transition-colors first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:py-6">
      <span aria-hidden="true" className="editorial-index-sm tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h4 className="text-h4">
          {href ? (
            <Link
              href={href}
              className="text-ink transition-colors hover:text-brand-green-dark focus-visible:text-brand-green-dark"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h4>
        <p className="mt-1 text-ink-muted">{benefit}</p>
      </div>
      {href ? (
        <Icon
          name="arrow-right"
          size={18}
          className="col-start-2 mt-1 text-brand-green-dark transition-transform duration-200 group-hover:translate-x-1 sm:col-start-3 sm:mt-0"
        />
      ) : null}
    </li>
  );
}

/**
 * Two capabilities, two distinct editorial compositions — a coded software
 * dashboard on the left, real marketing photography on the right — instead
 * of fourteen identical icon cards (spec FR-013).
 */
export function ServicesOverview() {
  const { services } = home;
  const solutions = getSolutions();
  const marketing = getMarketingServices().flatMap((service) =>
    service.covers.map((covered) => ({
      ...covered,
      href: hasPage(service) ? `/digital-marketing/${service.slug}` : "/digital-marketing",
    })),
  );

  const softwareRows: Row[] = [
    ...solutions.map((s) => ({
      name: s.name,
      benefit: s.summary,
      href: hasPage(s) ? `/solutions/${s.slug}` : undefined,
    })),
    {
      name: services.software.digitalization.name,
      benefit: services.software.digitalization.benefit,
      href: services.software.digitalization.href,
    },
  ];

  return (
    <Section surface="white" id="services" labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        level={2}
        eyebrow={services.eyebrow}
        title={services.heading}
        intro={services.intro}
      />

      {/* 01 — Business Software & Digital Solutions: coded product illustration, text left. */}
      <div className="mt-16 border-t border-line pt-16 lg:mt-20 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">01 — What we build</p>
            <h3 className="mt-3 text-h2">{services.software.heading}</h3>
            <p className="mt-4 text-lead text-ink-muted">{services.software.intro}</p>
            <div className="mt-8">
              <ButtonLink
                href="/solutions"
                variant="secondary"
                size="lg"
                track={{
                  event: "cta_click",
                  label: "Explore Solutions",
                  location: "services-software",
                }}
              >
                Explore Solutions
              </ButtonLink>
            </div>
          </div>
          <SoftwareShowcase className="motion-reveal-right lg:col-span-7" />
        </div>
        <ol className="motion-stagger mt-14 lg:mt-16">
          {softwareRows.map((row, i) => (
            <CapabilityRow key={row.name} index={i + 1} {...row} />
          ))}
        </ol>
      </div>

      {/* 02 — Digital Marketing & Growth: real photography, visual left for asymmetry. */}
      <div className="mt-16 border-t border-line pt-16 lg:mt-20 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <MarketingShowcase
            image={sectionImages.marketingAnalytics}
            className="motion-reveal-left order-2 lg:order-1 lg:col-span-7"
          />
          <div className="order-1 lg:order-2 lg:col-span-5">
            <p className="eyebrow">02 — How we grow it</p>
            <h3 className="mt-3 text-h2">{services.marketing.heading}</h3>
            <p className="mt-4 text-lead text-ink-muted">{services.marketing.intro}</p>
            <div className="mt-8">
              <ButtonLink
                href="/digital-marketing"
                variant="secondary"
                size="lg"
                track={{
                  event: "cta_click",
                  label: "Explore Digital Marketing",
                  location: "services-marketing",
                }}
              >
                Explore Digital Marketing
              </ButtonLink>
            </div>
          </div>
        </div>
        <ol className="motion-stagger mt-14 lg:mt-16">
          {marketing.map((m, i) => (
            <CapabilityRow key={m.name} index={i + 1} name={m.name} benefit={m.benefit} href={m.href} />
          ))}
        </ol>
      </div>

      <p className="pull-quote mt-16 border-t border-line pt-10 text-ink lg:mt-20">
        {services.closing}
      </p>
    </Section>
  );
}

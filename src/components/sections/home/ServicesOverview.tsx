import Link from "@/components/ui/AppLink";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getMarketingServices, getSolutions, hasPage } from "@/lib/content";

/** Two service categories under one growth offering (spec FR-013). */
export function ServicesOverview() {
  const { services } = home;
  const solutions = getSolutions();
  const marketing = getMarketingServices().flatMap((service) =>
    service.covers.map((covered) => ({
      ...covered,
      icon: service.icon,
      href: hasPage(service) ? `/digital-marketing/${service.slug}` : "/digital-marketing",
    })),
  );

  return (
    <Section surface="white" id="services" labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        level={2}
        eyebrow={services.eyebrow}
        title={services.heading}
        intro={services.intro}
      />

      <div className="mt-14">
        <div className="flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <h3 className="text-h3">{services.software.heading}</h3>
          <p className="text-ink-muted">{services.software.intro}</p>
        </div>
        <ul className="motion-reveal mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <li key={s.slug}>
              <ServiceCard
                name={s.name}
                benefit={s.summary}
                icon={s.icon}
                href={hasPage(s) ? `/solutions/${s.slug}` : undefined}
                headingLevel={4}
              />
            </li>
          ))}
          <li>
            <ServiceCard
              name={services.software.digitalization.name}
              benefit={services.software.digitalization.benefit}
              icon="refresh-cw"
              href={services.software.digitalization.href}
              headingLevel={4}
            />
          </li>
        </ul>
      </div>

      <div className="mt-16">
        <div className="flex flex-col gap-2 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <h3 className="text-h3">{services.marketing.heading}</h3>
          <p className="text-ink-muted">{services.marketing.intro}</p>
        </div>
        <ul className="motion-reveal mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {marketing.map((m) => (
            <li key={m.name}>
              <ServiceCard
                name={m.name}
                benefit={m.benefit}
                icon={m.icon}
                href={m.href}
                headingLevel={4}
              />
            </li>
          ))}
          <li>
            <Card variant="link" tone="deep" className="h-full">
              <span className="mb-5 inline-flex size-11 items-center justify-center rounded-control bg-brand-green text-ink">
                <Icon name="megaphone" size={22} />
              </span>
              <h4 className="text-h4">
                <Link href="/digital-marketing" className={stretchedLink}>
                  Explore digital marketing
                </Link>
              </h4>
              <p className="mt-2 text-fg-muted">
                See how marketing and software work together to grow your business.
              </p>
              <span
                aria-hidden="true"
                className="mt-auto inline-flex items-center gap-1 pt-5 text-small font-semibold"
              >
                View services <Icon name="arrow-right" size={16} className="text-brand-green" />
              </span>
            </Card>
          </li>
        </ul>
      </div>

      <p className="mt-12 font-heading text-h4 font-semibold text-ink">{services.closing}</p>
    </Section>
  );
}

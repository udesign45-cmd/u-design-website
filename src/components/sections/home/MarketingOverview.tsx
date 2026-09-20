import { ServiceCard } from "@/components/cards/ServiceCard";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";

/** "Don't Just Build Your Business. Grow It." (spec FR-018). No guaranteed results. */
export function MarketingOverview() {
  const { marketing } = home;
  return (
    <Section surface="gray" id="marketing" labelledBy="marketing-heading">
      <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <SectionHeading
            id="marketing-heading"
            level={2}
            eyebrow={marketing.eyebrow}
            title={marketing.heading}
            intro={marketing.intro}
          />
          <ul className="motion-reveal mt-8 grid gap-3" aria-label="Business outcomes">
            {marketing.outcomes.map((o) => (
              <li key={o} className="flex items-center gap-3 font-medium">
                <span className="inline-flex size-6 items-center justify-center rounded-pill bg-brand-green text-ink">
                  <Icon name="check" size={14} />
                </span>
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink
              href={marketing.cta.href}
              size="lg"
              track={{ event: "cta_click", label: marketing.cta.label, location: "marketing" }}
            >
              {marketing.cta.label}
            </ButtonLink>
          </div>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
          {marketing.items.map((item) => (
            <li key={item.name}>
              <ServiceCard
                name={item.name}
                benefit={item.benefit}
                icon={item.icon}
                headingLevel={3}
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import Link from "@/components/ui/AppLink";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { Section } from "@/components/layout/Section";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getIndustries, hasPage } from "@/lib/content";

/** Industry discovery with Manufacturing featured first (spec FR-014, FR-043). */
export function IndustriesGrid() {
  const industries = getIndustries();
  return (
    <Section surface="gray" id="industries" labelledBy="industries-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="industries-heading"
          level={2}
          eyebrow={home.industries.eyebrow}
          title={home.industries.heading}
          intro={home.industries.intro}
        />
        <Link href="/industries" className="shrink-0 font-semibold link-inline">
          {home.industries.allLink}
        </Link>
      </div>
      <ul className="motion-reveal mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, index) => (
          <li
            key={industry.slug}
            className={index === 0 ? "md:col-span-2 md:row-span-2" : undefined}
          >
            <IndustryCard
              industry={industry}
              feature={index === 0}
              href={hasPage(industry) ? `/industries/${industry.slug}` : undefined}
            />
          </li>
        ))}
        <li>
          <Card variant="link" tone="deep" className="h-full">
            <span className="inline-flex size-11 items-center justify-center rounded-control bg-brand-green text-ink">
              <Icon name="puzzle" size={22} />
            </span>
            <h3 className="mt-5 text-h4">
              <Link href="/industries" className={stretchedLink}>
                Another industry?
              </Link>
            </h3>
            <p className="mt-2 text-fg-muted">We adapt every solution to your specific workflow.</p>
          </Card>
        </li>
      </ul>
    </Section>
  );
}

import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { whyThemes } from "@/content/why";

/** Why U Design: four themes (spec FR-019). */
export function WhyUDesign() {
  return (
    <Section surface="white" id="why" labelledBy="why-heading">
      <SectionHeading
        id="why-heading"
        level={2}
        eyebrow={home.why.eyebrow}
        title={home.why.heading}
        intro={home.why.intro}
      />
      <ul className="motion-reveal mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {whyThemes.map((theme) => (
          <li key={theme.title}>
            <Card variant="feature" className="h-full">
              <span className="inline-flex size-12 items-center justify-center rounded-control bg-green-deep text-brand-green">
                <Icon name={theme.icon} size={24} />
              </span>
              <h3 className="mt-5 text-h4">{theme.title}</h3>
              <p className="mt-2 text-ink-muted">{theme.description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

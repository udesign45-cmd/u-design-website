import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DashboardPreview } from "@/components/visuals/DashboardPreview";
import { home } from "@/content/home";

const capabilities = [
  "Custom software",
  "ERP & CRM",
  "Dashboards",
  "Automation",
  "Digital marketing",
];

/**
 * Home hero (spec FR-010, FR-011). The H1 is the LCP element; the visual is
 * coded (no raster images) with a fixed aspect ratio (plan AD-05, AD-12).
 */
export function Hero() {
  const { hero } = home;
  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden surface-deep hero-backdrop">
      <Container className="grid items-center gap-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
        <div className="max-w-2xl">
          <p className="motion-fade-up eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 text-display">
            {hero.headline}
          </h1>
          <p className="motion-fade-up mt-6 text-lead text-fg-muted">{hero.lead}</p>
          <div className="motion-fade-up mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={hero.primaryCta.href}
              size="lg"
              track={{ event: "cta_click", label: hero.primaryCta.label, location: "hero" }}
            >
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              track={{ event: "cta_click", label: hero.secondaryCta.label, location: "hero" }}
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul
            aria-label="What we deliver"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-small text-fg-muted"
          >
            {capabilities.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5">
                <Icon name="check" size={16} className="text-brand-green" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="motion-fade-up">
          <DashboardPreview className="mx-auto max-w-xl lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}

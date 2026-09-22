import { Container } from "@/components/layout/Container";
import { HeroReveal } from "@/components/motion/HeroReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroMedia } from "@/components/visuals/HeroMedia";
import heroPoster from "@/assets/images/hero-poster.webp";
import { home } from "@/content/home";

const capabilities = [
  "Custom software",
  "ERP & CRM",
  "Dashboards",
  "Automation",
  "Digital marketing",
];

/**
 * Home hero (spec FR-010, FR-011). The H1 is the LCP element — the media
 * layer behind it is a lightweight poster photo with a video upgrade added
 * only after idle on wide viewports (see HeroMedia), so it never competes
 * for the critical path or the Core Web Vitals budget.
 */
export function Hero() {
  const { hero } = home;
  return (
    <section
      aria-labelledby="hero-heading"
      className="surface-ink relative isolate overflow-hidden"
    >
      <HeroMedia
        poster={heroPoster}
        posterAlt=""
        videoSrc="/videos/hero-corporate.mp4"
        className="absolute inset-0"
      />
      <div aria-hidden="true" className="media-scrim" />
      <Container className="relative py-14 pb-16 sm:py-20 md:py-24 lg:py-32">
        <HeroReveal className="max-w-2xl">
          <p data-reveal className="eyebrow">
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" className="mt-5 text-display">
            {hero.headline}
          </h1>
          <p data-reveal className="mt-6 max-w-xl text-lead text-fg-muted">
            {hero.lead}
          </p>
          <div data-reveal-motion className="mt-10 flex flex-col gap-3 sm:flex-row">
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
            data-reveal
            aria-label="What we deliver"
            className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-small text-fg-muted"
          >
            {capabilities.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5">
                <Icon name="check" size={16} className="text-brand-green" />
                {c}
              </li>
            ))}
          </ul>
        </HeroReveal>
      </Container>
    </section>
  );
}

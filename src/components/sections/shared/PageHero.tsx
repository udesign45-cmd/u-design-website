import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section, type Surface } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import type { Crumb } from "@/lib/seo/breadcrumbs";
import type { CtaLabel } from "@/types/content";

export type HeroCta = { label: CtaLabel; href: string };

type PageHeroProps = {
  title: string;
  intro: ReactNode;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
  /** Defaults to "Get Free Consultation". Pass `null` when the page itself is the form. */
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta;
  surface?: Surface;
  aside?: ReactNode;
  trackLocation?: string;
  /** Optional photo treatment for the band (used on template hubs). */
  image?: StaticImageData;
};

/** Page header with H1 and, by default, the consultation CTA above the fold (FR-004). */
export function PageHero({
  title,
  intro,
  eyebrow,
  breadcrumbs,
  primaryCta = { label: "Get Free Consultation", href: "/contact#consultation" },
  secondaryCta,
  surface = "deep",
  aside,
  trackLocation = "page-hero",
  image,
}: PageHeroProps) {
  return (
    <Section
      surface={surface}
      spacing="compact"
      className={image ? "relative isolate overflow-hidden pt-8 md:pt-10" : "pt-8 md:pt-10"}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 object-cover"
          />
          <div aria-hidden="true" className="media-scrim -z-10" />
        </>
      ) : null}
      {breadcrumbs ? <Breadcrumbs trail={breadcrumbs} /> : null}
      <div className={aside ? "mt-8 grid items-center gap-10 lg:grid-cols-2" : "mt-8"}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="mb-3 eyebrow">{eyebrow}</p> : null}
          <h1 className="text-h1">{title}</h1>
          <div className="mt-5 text-lead text-fg-muted">{intro}</div>
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta ? (
                <ButtonLink
                  href={primaryCta.href}
                  size="lg"
                  track={{ event: "cta_click", label: primaryCta.label, location: trackLocation }}
                >
                  {primaryCta.label}
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink
                  href={secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  track={{ event: "cta_click", label: secondaryCta.label, location: trackLocation }}
                >
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
        {aside}
      </div>
    </Section>
  );
}

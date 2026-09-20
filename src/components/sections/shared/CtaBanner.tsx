import { Section, type Surface } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { consultationHref } from "@/lib/cta";
import type { CtaLabel } from "@/types/content";

type CtaBannerProps = {
  title: string;
  text: string;
  context?: { industry?: string; need?: string; source?: string };
  /** At most one secondary CTA (constitution IX). */
  secondary?: { label: CtaLabel; href: string };
  surface?: Surface;
  id?: string;
};

/** Closing consultation section used by every template (FR-004, FR-020). */
export function CtaBanner({
  title,
  text,
  context,
  secondary,
  surface = "deep",
  id = "cta",
}: CtaBannerProps) {
  const headingId = `${id}-heading`;
  return (
    <Section surface={surface} id={id} labelledBy={headingId}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 eyebrow">Free consultation</p>
          <h2 id={headingId} className="text-h2">
            {title}
          </h2>
          <p className="mt-4 text-lead text-fg-muted">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            href={consultationHref(context)}
            size="lg"
            track={{ event: "cta_click", label: "Get Free Consultation", location: "cta-banner" }}
          >
            Get Free Consultation
          </ButtonLink>
          {secondary ? (
            <ButtonLink
              href={secondary.href}
              variant="secondary"
              size="lg"
              track={{ event: "cta_click", label: secondary.label, location: "cta-banner" }}
            >
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

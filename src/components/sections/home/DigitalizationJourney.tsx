import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneyDiagram } from "@/components/visuals/JourneyDiagram";
import { digitalization } from "@/content/digitalization";
import { consultationHref } from "@/lib/cta";

/** "Still Managing Your Business With Spreadsheets?" (spec FR-016). */
export function DigitalizationJourney() {
  return (
    <Section surface="ink" id="digitalization" labelledBy="digitalization-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          id="digitalization-heading"
          level={2}
          eyebrow={digitalization.eyebrow}
          title={digitalization.heading}
          intro={digitalization.intro}
        />
        <ul className="grid content-start gap-3 sm:grid-cols-2" aria-label="Common signs">
          {digitalization.painPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-control border border-white/10 bg-white/5 p-3.5"
            >
              <Icon
                name="file-spreadsheet"
                size={18}
                className="mt-0.5 shrink-0 text-brand-green"
              />
              <span className="text-small text-white/90">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="motion-reveal mt-14">
        <JourneyDiagram stages={digitalization.stages} />
      </div>

      <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-lead text-fg-muted">
          Tell us how your process works today. We will show you what a centralized system could
          look like.
        </p>
        <ButtonLink
          href={consultationHref({ source: "/#digitalization" })}
          size="lg"
          track={{
            event: "cta_click",
            label: digitalization.cta.label,
            location: "digitalization",
          }}
        >
          {digitalization.cta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}

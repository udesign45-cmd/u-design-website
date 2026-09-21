import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { whyThemes } from "@/content/why";
import { sectionImages } from "@/lib/content/images";

/**
 * Why U Design: four themes, laid out as a numbered editorial list beside a
 * photograph rather than four identical icon cards (spec FR-019).
 */
export function WhyUDesign() {
  return (
    <Section surface="white" id="why" labelledBy="why-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="why-heading"
            level={2}
            eyebrow={home.why.eyebrow}
            title={home.why.heading}
            intro={home.why.intro}
          />
          <ol className="motion-stagger mt-10 flex flex-col">
            {whyThemes.map((theme, index) => (
              <li
                key={theme.title}
                className="flex gap-5 border-t border-line py-6 first:border-t-0 first:pt-0"
              >
                <span aria-hidden="true" className="editorial-index shrink-0 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-h4">
                    <Icon name={theme.icon} size={20} className="text-brand-green-dark" />
                    {theme.title}
                  </h3>
                  <p className="mt-1.5 text-ink-muted">{theme.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="media-frame motion-reveal-right relative hidden overflow-hidden rounded-panel lg:block">
          <Image
            src={sectionImages.corporateTeam}
            alt=""
            fill
            sizes="45vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

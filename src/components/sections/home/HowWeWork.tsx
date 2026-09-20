import { ProcessSteps } from "@/components/cards/ProcessStep";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { processSteps } from "@/content/process";

/** Six-step process (spec FR-017). */
export function HowWeWork() {
  return (
    <Section surface="white" id="how-we-work" labelledBy="process-heading">
      <SectionHeading
        id="process-heading"
        level={2}
        eyebrow={home.process.eyebrow}
        title={home.process.heading}
        intro={home.process.intro}
      />
      <div className="motion-reveal mt-12">
        <ProcessSteps steps={processSteps} />
      </div>
    </Section>
  );
}

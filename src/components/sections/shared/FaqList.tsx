import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Faq } from "@/types/content";

/** Visible FAQ content; only rendered when real questions exist (enables FAQPage JSON-LD). */
export function FaqList({
  faqs,
  heading = "Frequently asked questions",
}: {
  faqs: Faq[];
  heading?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <Section surface="gray" id="faq" labelledBy="faq-heading">
      <SectionHeading id="faq-heading" level={2} title={heading} />
      <dl className="mt-10 grid max-w-3xl gap-6">
        {faqs.map((f) => (
          <div key={f.question} className="rounded-card border border-line bg-white p-6">
            <dt className="font-heading text-h4 font-semibold">{f.question}</dt>
            <dd className="mt-2 text-ink-muted">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

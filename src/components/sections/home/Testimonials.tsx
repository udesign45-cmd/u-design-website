import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getVerifiedTestimonials } from "@/lib/content";

/** Renders only with at least 1 verified testimonial (constitution II). Empty at launch. */
export function Testimonials() {
  const testimonials = getVerifiedTestimonials();
  if (testimonials.length === 0) return null;
  return (
    <Section surface="white" id="testimonials" labelledBy="testimonials-heading">
      <SectionHeading id="testimonials-heading" level={2} title="What our clients say" />
      <ul className="motion-reveal mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <li key={`${t.name}-${t.company}`}>
            <TestimonialCard testimonial={t} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

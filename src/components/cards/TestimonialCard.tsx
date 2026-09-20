import Image from "next/image";
import type { Testimonial } from "@/types/content";

/** Verified testimonials only; unverified entries render nothing (constitution II). */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  if (!testimonial.verified) return null;
  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card">
      <blockquote className="flex-1 text-lead text-ink">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {testimonial.photo ? (
          <Image
            src={testimonial.photo.src}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-pill object-cover"
          />
        ) : null}
        <span>
          <span className="block font-semibold">{testimonial.name}</span>
          <span className="block text-small text-ink-muted">
            {testimonial.role}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

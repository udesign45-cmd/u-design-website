import { clientLogos } from "@/content/client-logos";
import { faqs } from "@/content/faqs";
import { stats } from "@/content/stats";
import { testimonials } from "@/content/testimonials";
import type { ClientLogo, Faq, Stat, Testimonial } from "@/types/content";

export function filterVerifiedTestimonials(list: Testimonial[]): Testimonial[] {
  return list.filter((t) => t.verified === true);
}
export function filterVerifiedStats(list: Stat[]): Stat[] {
  return list.filter((s) => s.verified === true && s.source.trim().length > 0);
}
export function filterApprovedLogos(list: ClientLogo[]): ClientLogo[] {
  return list.filter((l) => l.permissionConfirmed === true);
}

export const getVerifiedTestimonials = () => filterVerifiedTestimonials(testimonials);
export const getVerifiedStats = () => filterVerifiedStats(stats);
export const getApprovedLogos = () => filterApprovedLogos(clientLogos);
export const getFaqs = (scope: string): Faq[] => faqs[scope] ?? [];

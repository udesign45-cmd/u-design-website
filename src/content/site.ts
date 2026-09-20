import type { SiteProfile } from "@/types/content";

/**
 * Company profile. Only confirmed facts live here — never invent contact
 * details (constitution II).
 *
 * CONTENT INPUT REQUIRED (Q-2, Q-7): logo, email, phone, location, socials,
 * responseTime and hours are intentionally empty until U Design supplies them.
 * Components hide anything that is not provided.
 */
export const site: SiteProfile = {
  name: "U Design",
  tagline: "Build. Market. Grow.",
  positioning: "Digital Solutions That Help Businesses Grow",
  logo: undefined,
  email: undefined,
  phone: undefined,
  location: undefined,
  socials: [],
  responseTime: undefined,
  hours: undefined,
};

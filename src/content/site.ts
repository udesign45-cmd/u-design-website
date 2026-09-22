import logoDark from "@/assets/images/logo-dark.webp";
import logoLight from "@/assets/images/logo-light.webp";
import type { SiteProfile } from "@/types/content";

/**
 * Company profile. Only confirmed facts live here — never invent contact
 * details (constitution II).
 *
 * CONTENT INPUT REQUIRED (Q-7): email, socials, responseTime and hours are
 * intentionally empty until U Design supplies them. Components hide anything
 * that is not provided.
 */
export const site: SiteProfile = {
  name: "U Design",
  tagline: "Build. Market. Grow.",
  positioning: "Digital Solutions That Help Businesses Grow",
  logo: { src: logoDark, alt: "U Design" },
  logoLight: { src: logoLight, alt: "U Design" },
  email: undefined,
  phone: { display: "+92 330 8738597", e164: "+923308738597" },
  location: { city: "Karachi", country: "Pakistan" },
  socials: [],
  responseTime: undefined,
  hours: undefined,
};

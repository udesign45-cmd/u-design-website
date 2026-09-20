/**
 * Static navigation copy. Menu children are derived from published content in
 * src/lib/content/navigation.ts.
 */
export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions", menu: "solutions" },
  { label: "Industries", href: "/industries", menu: "industries" },
  { label: "Digital Marketing", href: "/digital-marketing", menu: "marketing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const consultationCta = {
  label: "Get Free Consultation",
  href: "/contact#consultation",
} as const;

/** Legal links are derived from src/content/legal (visible pages only). */

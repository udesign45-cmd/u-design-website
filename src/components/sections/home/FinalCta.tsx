import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { home } from "@/content/home";
import { sectionImages } from "@/lib/content/images";

/** Closing consultation section (spec FR-020). */
export function FinalCta() {
  return (
    <CtaBanner
      id="final-cta"
      title={home.finalCta.heading}
      text={home.finalCta.text}
      context={{ source: "/#final-cta" }}
      secondary={{ label: "View Our Solutions", href: "/solutions" }}
      image={sectionImages.corporateTechnology}
    />
  );
}

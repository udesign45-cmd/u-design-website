"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Choreographed entrance for everything in the hero except the H1 (the LCP
 * element, which must paint immediately and never animate). Animates
 * descendants marked `data-reveal` (fade + slide) or `data-reveal-motion`
 * (slide only, opacity untouched) — the H1 sits inside the scope, between
 * the eyebrow and the lead paragraph, matching its normal position, without
 * being touched by either. `data-reveal-motion` exists for elements that
 * must never sit at reduced opacity even mid-transition, such as the CTA
 * buttons: a fading button briefly fails color-contrast while it crosses
 * partial opacity (axe caught this on the primary CTA — T212). Respects
 * prefers-reduced-motion via matchMedia: reduced-motion users get the final
 * state with no motion.
 */
export function HeroReveal({ children, className }: HeroRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = scope.current
        ? Array.from(scope.current.querySelectorAll("[data-reveal], [data-reveal-motion]"))
        : [];
      if (!items.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fadeItems = items.filter((el) => el.hasAttribute("data-reveal"));
        const motionOnlyItems = items.filter((el) => el.hasAttribute("data-reveal-motion"));

        gsap.set(fadeItems, { opacity: 0, y: 18 });
        gsap.set(motionOnlyItems, { y: 18 });

        const tl = gsap.timeline({ delay: 0.1, defaults: { duration: 0.7, ease: "power2.out" } });
        items.forEach((el, i) => {
          tl.to(el, el.hasAttribute("data-reveal") ? { opacity: 1, y: 0 } : { y: 0 }, i * 0.12);
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

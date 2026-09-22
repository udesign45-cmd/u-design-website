"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ElementType, ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ScrollStaggerProps = {
  children: ReactNode;
  /** Element the scope renders as — match what the CSS-only version used (ol/ul/div). */
  as?: ElementType;
  className?: string;
  /** Seconds between each child's start. */
  stagger?: number;
};

/**
 * GSAP ScrollTrigger version of the site's `.motion-stagger` CSS utility, for
 * the sections chosen for a richer reveal. Animates direct children once,
 * the first time the scope enters the viewport. Respects
 * prefers-reduced-motion via matchMedia — reduced-motion users get the final
 * state with no motion and no ScrollTrigger created.
 */
export function ScrollStagger({
  children,
  as: Tag = "div",
  className,
  stagger = 0.1,
}: ScrollStaggerProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = scope.current ? Array.from(scope.current.children) : [];
      if (!items.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Plain opacity, not autoAlpha: the items must stay keyboard-focusable
        // and discoverable by assistive tech the whole time — autoAlpha's
        // visibility:hidden would pull them out of the tab order and the
        // accessibility tree before they've had a chance to scroll into view.
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}

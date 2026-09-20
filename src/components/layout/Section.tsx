import type { ReactNode } from "react";
import { cx } from "@/lib/utils/cx";
import { Container } from "./Container";

export type Surface = "white" | "gray" | "ink" | "deep";

const surfaceClass: Record<Surface, string> = {
  white: "surface-white",
  gray: "surface-gray",
  ink: "surface-ink",
  deep: "surface-deep",
};

type SectionProps = {
  children: ReactNode;
  surface?: Surface;
  id?: string;
  labelledBy?: string;
  spacing?: "default" | "compact" | "none";
  container?: "default" | "narrow" | false;
  className?: string;
};

/** A page section on one of the four approved surfaces (plan: Section variants). */
export function Section({
  children,
  surface = "white",
  id,
  labelledBy,
  spacing = "default",
  container = "default",
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        surfaceClass[surface],
        spacing === "default" && "py-section",
        spacing === "compact" && "py-section-compact",
        className,
      )}
    >
      {container ? <Container size={container}>{children}</Container> : children}
    </section>
  );
}

import type { ReactNode } from "react";
import { cx } from "@/lib/utils/cx";

type SectionHeadingProps = {
  title: ReactNode;
  level: 1 | 2 | 3;
  eyebrow?: string;
  intro?: ReactNode;
  id?: string;
  align?: "start" | "center";
  size?: "display" | "default";
  className?: string;
};

const levelClass = { 1: "text-h1", 2: "text-h2", 3: "text-h3" } as const;

/** Eyebrow + heading + intro. `level` is required so the outline is explicit. */
export function SectionHeading({
  title,
  level,
  eyebrow,
  intro,
  id,
  align = "start",
  size = "default",
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={cx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="mb-3 eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className={size === "display" ? "text-display" : levelClass[level]}>
        {title}
      </Heading>
      {intro ? <div className="mt-4 text-lead text-fg-muted">{intro}</div> : null}
    </div>
  );
}

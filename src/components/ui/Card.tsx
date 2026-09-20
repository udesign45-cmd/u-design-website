import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/utils/cx";

export type CardVariant = "default" | "feature" | "link";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  padding?: "default" | "none";
  tone?: "white" | "deep";
  as?: ElementType;
  className?: string;
};

/**
 * Surface card. The `link` variant expects exactly one stretched link inside
 * (use `stretchedLink`) so the whole card is clickable but announced once.
 */
export function Card({
  children,
  variant = "default",
  padding = "default",
  tone = "white",
  as: Tag = "div",
  className,
}: CardProps) {
  return (
    <Tag
      className={cx(
        "relative flex flex-col rounded-card border shadow-card",
        tone === "deep" ? "border-green-deep surface-deep" : "border-line bg-white text-ink",
        padding === "default" && (variant === "feature" ? "p-7 lg:p-8" : "p-6"),
        variant === "link" &&
          "transition-[transform,box-shadow] duration-250 ease-standard focus-within:shadow-raised hover:-translate-y-0.5 hover:shadow-raised",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Makes a link cover its positioned card; focus ring is drawn around the card. */
export const stretchedLink =
  "after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-green-dark";

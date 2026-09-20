import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/utils/cx";

type ContainerProps = {
  children: ReactNode;
  size?: "default" | "narrow";
  as?: ElementType;
  className?: string;
};

/** Page-width wrapper: 1200px content + responsive gutters (16/24/32px). */
export function Container({
  children,
  size = "default",
  as: Tag = "div",
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cx(
        "mx-auto w-full px-4 md:px-6 xl:px-8",
        size === "narrow" ? "max-w-narrow" : "max-w-page",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

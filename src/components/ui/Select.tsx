import type { SelectHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";
import { controlClasses } from "./Field";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(controlClasses, "appearance-auto pr-8", className)} {...props}>
      {children}
    </select>
  );
}

import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";
import { controlClasses } from "./Field";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(controlClasses, className)} {...props} />;
}

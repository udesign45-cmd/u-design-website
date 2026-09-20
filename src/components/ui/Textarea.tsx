import type { TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";
import { controlClasses } from "./Field";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(controlClasses, "min-h-32 resize-y", className)} {...props} />;
}

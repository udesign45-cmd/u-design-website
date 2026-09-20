import type { ReactNode } from "react";
import { cx } from "@/lib/utils/cx";

export type BadgeVariant = "neutral" | "concept" | "client" | "category";

const styles: Record<BadgeVariant, string> = {
  neutral: "bg-surface-gray text-ink border-line",
  concept: "bg-white text-ink border-ink/25",
  client: "bg-ink text-white border-ink",
  category: "bg-brand-green/15 text-ink border-brand-green/40",
};

/** Text-labelled badge; meaning never depends on color alone (constitution V). */
export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-small font-medium whitespace-nowrap",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

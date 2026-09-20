import Link from "@/components/ui/AppLink";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils/cx";
import { ArrowRightIcon } from "./InlineIcons";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

export type TrackProps = { event: string; label?: string; location?: string };

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,border-color] duration-150 ease-standard " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Ink on brand green = 10.24:1. Hover never switches to dark green (plan: hover rule).
  primary:
    "bg-brand-green text-ink shadow-card hover:-translate-y-px hover:shadow-raised active:translate-y-0",
  // Adapts to the surface through --surface-fg.
  secondary: "border border-fg/35 text-fg hover:border-fg hover:bg-fg/5",
  ghost: "text-fg underline-offset-4 hover:underline",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-body",
  lg: "min-h-12 px-6 text-body",
};

function trackAttributes(track?: TrackProps) {
  if (!track) return {};
  return {
    "data-track": track.event,
    "data-track-label": track.label,
    "data-track-location": track.location,
  };
}

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cx(
    base,
    variants[variant],
    variant !== "ghost" && sizes[size],
    variant === "ghost" && "min-h-11",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  track?: TrackProps;
};

export function Button({
  variant = "primary",
  size = "md",
  track,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...trackAttributes(track)}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  track?: TrackProps;
  external?: boolean;
  arrow?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  track,
  external = false,
  arrow = variant === "ghost",
  className,
  ...rest
}: ButtonLinkProps) {
  const content = (
    <>
      {children}
      {arrow ? <ArrowRightIcon size={18} /> : null}
    </>
  );
  const classes = buttonClasses(variant, size, className);
  const attrs = { ...trackAttributes(track), "aria-label": rest["aria-label"] };

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...attrs}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...attrs}>
      {content}
    </Link>
  );
}

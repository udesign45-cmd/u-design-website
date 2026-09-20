/**
 * Minimal inline SVG icons for components that are also rendered inside client
 * islands (form, buttons). Keeps the icon library out of client bundles
 * (plan AD-12). Paths follow the same 24px, 1.75 stroke style as the Icon set.
 */
import type { ReactNode } from "react";

type Props = { size?: number; className?: string };

function Svg({ size = 20, className, children }: Props & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Svg>
  );
}

export function AlertIcon(props: Props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </Svg>
  );
}

export function CheckIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

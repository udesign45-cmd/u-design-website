import { createElement } from "react";
import { iconData } from "./icon-data";

/**
 * Approved icon set (data-model `IconName`), rendered as plain server-side SVG.
 * Icon geometry comes from Lucide (ISC) via scripts/generate-icons.mjs; no icon
 * library code is shipped to the browser (plan AD-12).
 */
export type IconName = keyof typeof iconData;

type IconProps = {
  name: IconName;
  size?: number;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 20, label, className }: IconProps) {
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
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    >
      {iconData[name].map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs }))}
    </svg>
  );
}

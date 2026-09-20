/** Joins truthy class names. Replaces clsx/tailwind-merge (plan AD-11). */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

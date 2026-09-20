const formatter = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

/** Formats an ISO date (YYYY-MM-DD or full ISO) as e.g. "September 19, 2026". */
export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}

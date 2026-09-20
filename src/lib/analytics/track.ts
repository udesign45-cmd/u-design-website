import { GA4_NAMES, META_NAMES, type AnalyticsEventName, type AnalyticsEvents } from "./events";

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;
type Fbq = (
  command: "track" | "trackCustom",
  name: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    udesignConsent?: "granted" | "denied";
  }
}

/**
 * Sends an event to configured providers. A no-op when analytics is not
 * configured (plan AD-09) or when consent is required but not granted.
 */
export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;
  if (
    process.env.NEXT_PUBLIC_ANALYTICS_CONSENT === "required" &&
    window.udesignConsent !== "granted"
  )
    return;
  const params = props as Record<string, unknown>;
  window.gtag?.("event", GA4_NAMES[event], params);
  const metaName = META_NAMES[event];
  if (metaName) window.fbq?.("track", metaName, params);
}

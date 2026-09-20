/** Typed analytics catalogue (contracts/analytics-events.md). Never carries personal data. */
export type AnalyticsEvents = {
  consultation_submit: { industry: string; need: string; source_page: string };
  cta_click: { label: string; location: string; page: string };
  contact_click: { channel: string; page: string };
  portfolio_view: { project: string; type: string; industry?: string };
  portfolio_filter: { industry?: string; solution?: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

/** Provider event names per our catalogue event. */
export const GA4_NAMES: Record<AnalyticsEventName, string> = {
  consultation_submit: "generate_lead",
  cta_click: "cta_click",
  contact_click: "contact_click",
  portfolio_view: "view_item",
  portfolio_filter: "portfolio_filter",
};

export const META_NAMES: Partial<Record<AnalyticsEventName, string>> = {
  consultation_submit: "Lead",
  contact_click: "Contact",
  portfolio_view: "ViewContent",
};

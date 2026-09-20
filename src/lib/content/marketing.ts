import { marketingServices } from "@/content/marketing";
import type { MarketingService, MarketingServicePage } from "@/types/content";
import { byOrder, hasPage, isVisible } from "./core";

export function getMarketingServices(): MarketingService[] {
  return marketingServices.filter(isVisible).sort(byOrder);
}

export function getMarketingService(slug: string): MarketingService | undefined {
  return getMarketingServices().find((s) => s.slug === slug);
}

export function getMarketingPages(): MarketingServicePage[] {
  return getMarketingServices().filter(hasPage) as MarketingServicePage[];
}

export function getMarketingPage(slug: string): MarketingServicePage | undefined {
  return getMarketingPages().find((s) => s.slug === slug);
}

export function getAllMarketingServices(): MarketingService[] {
  return [...marketingServices].sort(byOrder);
}

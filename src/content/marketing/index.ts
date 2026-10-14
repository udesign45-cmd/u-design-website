import type { MarketingService } from "@/types/content";
import { contentCreation } from "./content";
import { digitalStrategy } from "./digital-strategy";
import { googleAds } from "./google-ads";
import { growthMarketing } from "./growth-marketing";
import { leadGeneration } from "./lead-generation";
import { metaAds } from "./meta-ads";
import { seo } from "./seo";
import { socialMedia } from "./social-media";

/** All marketing services. `covers` lists the spec service names each entry includes. */
export const marketingServices: MarketingService[] = [
  socialMedia,
  metaAds,
  contentCreation,
  leadGeneration,
  digitalStrategy,
  googleAds,
  seo,
  growthMarketing,
];

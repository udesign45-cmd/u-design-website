/**
 * Editorial photography for the visual redesign (2026-09-21). Licensed,
 * royalty-free stock (Unsplash), self-hosted and served through next/image.
 * Decorative context imagery, not client or product photography — see
 * constitution II and qa/content-review.md.
 */
import type { StaticImageData } from "next/image";
import corporateTeam from "@/assets/images/corporate-team.webp";
import corporateTechnology from "@/assets/images/corporate-technology.webp";
import industryConstruction from "@/assets/images/industry-construction.webp";
import industryDistribution from "@/assets/images/industry-distribution.webp";
import industryHealthcare from "@/assets/images/industry-healthcare.webp";
import industryLogistics from "@/assets/images/industry-logistics.webp";
import industryManufacturing from "@/assets/images/industry-manufacturing.webp";
import industryRealEstate from "@/assets/images/industry-real-estate.webp";
import industryRetail from "@/assets/images/industry-retail.webp";
import industryTravel from "@/assets/images/industry-travel.webp";
import manufacturingHero from "@/assets/images/manufacturing-hero.webp";
import marketingAnalytics from "@/assets/images/marketing-analytics.webp";

export const industryImages: Record<string, StaticImageData> = {
  manufacturing: industryManufacturing,
  distribution: industryDistribution,
  "real-estate": industryRealEstate,
  construction: industryConstruction,
  logistics: industryLogistics,
  travel: industryTravel,
  healthcare: industryHealthcare,
  retail: industryRetail,
};

export const sectionImages = {
  manufacturingWide: manufacturingHero,
  corporateTeam,
  corporateTechnology,
  marketingAnalytics,
};

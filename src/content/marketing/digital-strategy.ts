import type { MarketingService } from "@/types/content";

/** Hub-only until a dedicated page is written (plan AD-02). */
export const digitalStrategy: MarketingService = {
  slug: "digital-strategy",
  name: "Digital Strategy",
  category: "marketing",
  summary:
    "A practical plan that connects your business goals, audiences, channels and systems, so every marketing activity has a purpose.",
  icon: "compass",
  order: 5,
  status: "published",
  covers: [
    {
      name: "Digital Strategy",
      benefit: "A practical plan connecting your goals, audience, channels and business systems.",
    },
  ],
  hasPage: false,
};

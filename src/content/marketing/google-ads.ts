import type { MarketingService } from "@/types/content";

export const googleAds: MarketingService = {
  slug: "google-ads",
  name: "Google Ads",
  category: "marketing",
  summary: "Search and display campaigns that reach people actively looking for what you offer.",
  icon: "megaphone",
  order: 6,
  status: "published",
  covers: [
    {
      name: "Google Ads",
      benefit: "Search and display campaigns aimed at people already looking for your business.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Google Ads Management for Search and Display",
    intro:
      "Reach people actively searching for what you offer with campaigns that are planned, tracked and improved, not left running on autopilot.",
  },
  problem: {
    heading: "Where Google Ads spend goes to waste",
    points: [
      {
        title: "Broad keywords with no intent match",
        description: "Budget is spent on searches that have little to do with what you actually sell.",
      },
      {
        title: "No conversion tracking",
        description: "Clicks are measured, but it is unclear which campaigns lead to real enquiries.",
      },
      {
        title: "Campaigns set up once and left alone",
        description: "Bids, keywords and budgets are never revisited after the initial setup.",
      },
    ],
  },
  approach: {
    heading: "How we manage your campaigns",
    body: [
      "We start with the searches that matter to your business: the keywords, locations and intent that lead to real enquiries, and structure campaigns around them with conversion tracking in place before launch.",
      "Campaigns are reviewed regularly, moving budget toward what brings enquiries and away from keywords and placements that do not, with clear reporting on what your spend delivers.",
    ],
  },
  features: [
    {
      title: "Keyword and intent research",
      description: "Target the searches that match what your business actually offers.",
    },
    {
      title: "Search and display campaigns",
      description: "Reach people searching directly, and build awareness across relevant sites.",
    },
    {
      title: "Conversion tracking",
      description: "Measure enquiries and actions, not just clicks.",
    },
    {
      title: "Bid and budget management",
      description: "Spend directed toward the keywords and placements that perform.",
    },
    {
      title: "Ongoing optimization",
      description: "Regular review of keywords, ad copy and budget allocation.",
    },
  ],
  outcomes: [
    {
      title: "Reach active intent",
      description: "Campaigns target people already searching for what you offer.",
    },
    {
      title: "Generate measurable enquiries",
      description: "Conversion tracking shows which campaigns bring real business.",
    },
    {
      title: "Spend with a clear purpose",
      description: "Budget moves toward what performs, reviewed on a regular basis.",
    },
  ],
  benefits: [
    {
      title: "Less wasted spend",
      description: "Keywords and targeting are matched to genuine buying intent.",
    },
    {
      title: "Clear reporting",
      description: "Understand what each campaign delivers in business terms.",
    },
    {
      title: "Campaigns that improve over time",
      description: "Regular review means performance is not left to chance after launch.",
    },
  ],
  useCases: [
    "Search campaigns for high-intent keywords",
    "Local campaigns for branch or service-area businesses",
    "Display campaigns for brand awareness",
    "Remarketing to past website visitors",
  ],
  industries: ["real-estate", "healthcare", "retail", "travel"],
  projects: [],
  faqs: [
    {
      question: "What is the difference between Google Ads and SEO?",
      answer:
        "Google Ads places your business at the top of search results immediately through paid campaigns, while SEO builds visibility in the unpaid results over time. Many businesses use both together.",
    },
    {
      question: "How much budget do I need for Google Ads?",
      answer:
        "Budget depends on your industry, competition and goals. We agree a starting budget with you and adjust it based on what the campaigns deliver, rather than fixing a number in advance.",
    },
    {
      question: "How do you know which keywords to target?",
      answer:
        "We research the searches that match real buying intent for your business, rather than broad or generic terms that bring clicks but not enquiries.",
    },
    {
      question: "Can you track which campaigns actually bring enquiries?",
      answer:
        "Yes. Conversion tracking is set up before a campaign launches, so reporting shows enquiries and actions, not just clicks and impressions.",
    },
  ],
  seo: {
    title: "Google Ads Management: Search and Display Campaigns",
    description:
      "Google Ads management covering search and display campaigns, keyword research, conversion tracking and ongoing optimization for qualified enquiries.",
  },
};

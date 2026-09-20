import type { MarketingService } from "@/types/content";

export const leadGeneration: MarketingService = {
  slug: "lead-generation",
  name: "Lead Generation & Performance Marketing",
  category: "marketing",
  summary:
    "Campaigns, landing pages and tracking designed to turn interest into measurable enquiries.",
  icon: "trending-up",
  order: 4,
  status: "published",
  covers: [
    {
      name: "Lead Generation",
      benefit: "Campaigns and landing pages designed to turn interest into enquiries.",
    },
    {
      name: "Performance Marketing",
      benefit: "Measure what each campaign delivers and move budget to what works.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Lead Generation and Performance Marketing",
    intro:
      "Connect campaigns, landing pages and follow-up so marketing produces enquiries your sales team can act on, and every channel is measured by what it delivers.",
  },
  problem: {
    heading: "Why marketing often fails to produce enquiries",
    points: [
      {
        title: "Traffic without enquiries",
        description:
          "People visit your pages or profiles but there is no clear, simple way to get in touch.",
      },
      {
        title: "Leads that are not followed up",
        description: "Enquiries arrive in different inboxes and some are never answered.",
      },
      {
        title: "No clear measurement",
        description: "It is hard to say which channel or campaign produced which customer.",
      },
    ],
  },
  approach: {
    heading: "How we generate and measure leads",
    body: [
      "We design the full path from first contact to enquiry: the audience, the message, the landing page and the form. Tracking is configured so every enquiry can be traced to its source.",
      "Because we also build business software, enquiries can flow straight into a CRM for follow-up. Performance is reviewed regularly and budget moves to the channels that produce useful leads.",
    ],
  },
  features: [
    {
      title: "Landing pages",
      description: "Focused pages with a clear offer and a simple enquiry form.",
    },
    {
      title: "Multi-channel campaigns",
      description: "Coordinated campaigns across paid social, search and other relevant channels.",
    },
    {
      title: "Lead tracking",
      description: "Source and campaign data captured with every enquiry.",
    },
    {
      title: "CRM connection",
      description: "Send enquiries directly to your sales team's system for follow-up.",
    },
    {
      title: "Performance reporting",
      description: "Cost and results per channel, reviewed regularly.",
    },
  ],
  outcomes: [
    {
      title: "Generate enquiries",
      description: "Campaigns are built around getting qualified prospects to contact you.",
    },
    {
      title: "Improve follow-up",
      description: "Every enquiry reaches the right person quickly.",
    },
    {
      title: "Support business growth",
      description: "Measured results show where additional investment makes sense.",
    },
  ],
  benefits: [
    {
      title: "Accountable marketing",
      description: "Spend is judged by enquiries and customers, not only by clicks.",
    },
    {
      title: "Marketing and sales connected",
      description: "Leads move from campaign to CRM without manual steps.",
    },
    {
      title: "Continuous improvement",
      description: "Regular reviews move budget towards what works.",
    },
  ],
  useCases: [
    "B2B enquiry campaigns",
    "Property and project launches",
    "Seasonal travel promotions",
    "Dealer and distributor recruitment",
  ],
  industries: ["real-estate", "travel", "manufacturing", "distribution", "retail"],
  projects: [],
  seo: {
    title: "Lead Generation and Performance Marketing Services",
    description:
      "Lead generation services and performance marketing: landing pages, campaigns, lead tracking and CRM integration so marketing turns into enquiries.",
  },
};

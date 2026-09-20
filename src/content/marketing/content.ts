import type { MarketingService } from "@/types/content";

export const contentCreation: MarketingService = {
  slug: "content",
  name: "Content Creation",
  category: "marketing",
  summary:
    "Clear posts, visuals and videos that explain what your business does and why it matters.",
  icon: "pen-line",
  order: 3,
  status: "published",
  covers: [
    {
      name: "Content Creation",
      benefit: "Clear posts, visuals and videos that explain what you do and why it matters.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Content Creation for B2B Businesses",
    intro:
      "Professional posts, graphics, short videos and written content that explain your products, capabilities and projects to the people who make buying decisions.",
  },
  problem: {
    heading: "Why business content often fails to connect",
    points: [
      {
        title: "Too technical or too vague",
        description:
          "Content either lists specifications or uses empty slogans, and neither explains the value.",
      },
      {
        title: "Inconsistent visual style",
        description: "Posts and materials look different each time, which weakens the brand.",
      },
      {
        title: "No time to produce it",
        description:
          "Internal teams are busy running the business, so content is always postponed.",
      },
    ],
  },
  approach: {
    heading: "How we create your content",
    body: [
      "We learn how your business works and what your customers care about, then turn that into content in plain language: what problem you solve, how you solve it and what it means for the customer.",
      "Visuals follow your brand guidelines, and every piece is planned to support a goal, from brand awareness to enquiries.",
    ],
  },
  features: [
    {
      title: "Social media posts and graphics",
      description: "Designed posts that follow your brand identity.",
    },
    {
      title: "Short-form video",
      description: "Product, process and project videos suited to social platforms.",
    },
    {
      title: "Written content",
      description: "Captions, articles and website copy written for decision makers.",
    },
    {
      title: "Project and product showcases",
      description: "Content that shows your capabilities through real work.",
    },
  ],
  outcomes: [
    {
      title: "Build brand visibility",
      description: "Regular, well-made content keeps your business recognisable.",
    },
    {
      title: "Explain your value clearly",
      description: "Prospects understand what you offer before they contact you.",
    },
    {
      title: "Support every campaign",
      description: "Ready content makes advertising and lead generation more effective.",
    },
  ],
  benefits: [
    {
      title: "A consistent brand",
      description: "Every piece of content looks and sounds like your company.",
    },
    {
      title: "Less pressure on your team",
      description: "Content is produced without pulling staff away from operations.",
    },
    {
      title: "Content with a purpose",
      description: "Each piece is planned around a clear business goal.",
    },
  ],
  useCases: [
    "Monthly social media content",
    "Product catalogues and brochures",
    "Project case presentations",
    "Campaign creative",
  ],
  industries: ["manufacturing", "real-estate", "retail", "travel"],
  projects: [],
  seo: {
    title: "Content Creation Services for Businesses",
    description:
      "Content creation for businesses: social media posts, graphics, short videos and written content that explain your value to decision makers.",
  },
};

import type { MarketingService } from "@/types/content";

export const socialMedia: MarketingService = {
  slug: "social-media",
  name: "Social Media Marketing & Management",
  category: "marketing",
  summary: "A consistent, professional presence on the channels your customers and partners use.",
  icon: "share",
  order: 1,
  status: "published",
  covers: [
    {
      name: "Social Media Marketing",
      benefit: "Build brand visibility and reach the decision makers who matter to your business.",
    },
    {
      name: "Social Media Management",
      benefit:
        "A consistent, professional presence across your channels without adding workload to your team.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Social Media Marketing and Management for Businesses",
    intro:
      "Show customers, partners and future employees who you are and what you do, with a planned, consistent presence on the platforms that matter to your market.",
  },
  problem: {
    heading: "Why business social media often underperforms",
    points: [
      {
        title: "Irregular posting",
        description:
          "Accounts go quiet for weeks when the team is busy, which makes the business look inactive.",
      },
      {
        title: "Content that does not explain the business",
        description:
          "Posts rarely show what the company does, who it serves or why it is different.",
      },
      {
        title: "No link to business goals",
        description: "Activity is not connected to enquiries, recruitment or brand objectives.",
      },
    ],
  },
  approach: {
    heading: "How we manage your social media",
    body: [
      "We agree the audiences, messages and platforms that suit your business, then plan a monthly calendar of posts that explain your products, capabilities and projects in a professional tone.",
      "We create and publish the content, respond to the practical details of each platform and review what is working each month, so your presence improves over time rather than simply staying active.",
    ],
  },
  features: [
    {
      title: "Platform strategy",
      description:
        "Choose the right mix of LinkedIn, Facebook, Instagram and other channels for your audience.",
    },
    {
      title: "Monthly content calendar",
      description: "A planned schedule agreed in advance, so posting is consistent.",
    },
    {
      title: "Profile optimization",
      description: "Clear, complete business profiles that explain what you offer.",
    },
    {
      title: "Monthly performance review",
      description: "Reach, engagement and enquiries reviewed to guide the next month's plan.",
    },
  ],
  outcomes: [
    {
      title: "Reach the right audience",
      description:
        "Content is planned for the people who influence buying decisions in your market.",
    },
    {
      title: "Stronger brand visibility",
      description: "A steady, professional presence keeps your business in view.",
    },
    {
      title: "A credible first impression",
      description:
        "Prospective clients see an active, well-presented company when they look you up.",
    },
  ],
  benefits: [
    {
      title: "Time saved for your team",
      description: "Planning, creation and publishing are handled for you.",
    },
    {
      title: "Consistent messaging",
      description: "Every post supports the same brand and positioning.",
    },
    {
      title: "Decisions based on data",
      description: "Monthly reviews show what to continue and what to change.",
    },
  ],
  useCases: [
    "B2B brand building on LinkedIn",
    "Product and project showcases",
    "Recruitment and employer branding",
    "Event and launch promotion",
  ],
  industries: ["manufacturing", "real-estate", "travel", "retail", "healthcare"],
  projects: [],
  seo: {
    title: "Social Media Marketing and Management Services",
    description:
      "Social media marketing and management for businesses: platform strategy, content calendars, publishing and monthly reviews that build your brand.",
  },
};

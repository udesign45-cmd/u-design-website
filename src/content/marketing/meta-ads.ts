import type { MarketingService } from "@/types/content";

export const metaAds: MarketingService = {
  slug: "meta-ads",
  name: "Meta Ads",
  category: "marketing",
  summary: "Targeted Facebook and Instagram campaigns planned around qualified business enquiries.",
  icon: "target",
  order: 2,
  status: "published",
  covers: [
    {
      name: "Meta Ads",
      benefit: "Targeted Facebook and Instagram campaigns aimed at qualified business enquiries.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Meta Ads Management for Facebook and Instagram",
    intro:
      "Plan, run and improve Facebook and Instagram campaigns that reach the right audience and bring enquiries your team can follow up.",
  },
  problem: {
    heading: "Where ad budgets are often wasted",
    points: [
      {
        title: "Boosting posts without a plan",
        description: "Spend goes to broad audiences with no clear objective or measurement.",
      },
      {
        title: "Enquiries that are not tracked",
        description:
          "It is unclear which campaigns bring real enquiries and which only bring clicks.",
      },
      {
        title: "Creative that does not convert",
        description: "Ads look generic and do not give people a clear reason to contact you.",
      },
    ],
  },
  approach: {
    heading: "How we manage your campaigns",
    body: [
      "We start with the objective, whether that is enquiries, visits or awareness, and define the audience, offer and message for each campaign. Tracking is set up before launch so results can be measured.",
      "Campaigns are monitored and adjusted regularly: audiences, creative and budget move towards what produces useful enquiries, and you receive clear reporting on spend and results.",
    ],
  },
  features: [
    {
      title: "Campaign planning",
      description: "Objectives, audiences, budgets and schedules agreed before any spend.",
    },
    {
      title: "Audience targeting",
      description: "Reach people by location, interests and behaviour relevant to your business.",
    },
    {
      title: "Ad creative",
      description: "Visuals and copy that explain your offer and invite action.",
    },
    {
      title: "Conversion tracking",
      description: "Measure enquiries and actions, not just clicks and impressions.",
    },
    {
      title: "Ongoing optimization",
      description: "Regular adjustments to targeting, creative and budget.",
    },
  ],
  outcomes: [
    {
      title: "Generate enquiries",
      description: "Campaigns are designed around getting interested prospects to contact you.",
    },
    {
      title: "Reach the right audience",
      description: "Budget is focused on people likely to need what you offer.",
    },
    {
      title: "Know what your spend delivers",
      description: "Clear reporting shows the results of each campaign.",
    },
  ],
  benefits: [
    {
      title: "Controlled budgets",
      description: "Spend is planned and reviewed, not left running unchecked.",
    },
    {
      title: "Better use of creative",
      description: "Ads are tested and refined based on real performance.",
    },
    {
      title: "Transparent reporting",
      description: "Understand results in business terms, not platform jargon.",
    },
  ],
  useCases: [
    "Lead generation campaigns",
    "Product and service launches",
    "Retargeting website visitors",
    "Event registrations",
  ],
  industries: ["real-estate", "travel", "retail", "healthcare"],
  projects: [],
  seo: {
    title: "Meta Ads Management for Facebook and Instagram",
    description:
      "Meta Ads management for businesses: campaign planning, audience targeting, ad creative, conversion tracking and ongoing optimization.",
  },
};

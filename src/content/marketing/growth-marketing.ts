import type { MarketingService } from "@/types/content";

export const growthMarketing: MarketingService = {
  slug: "growth-marketing",
  name: "Growth Marketing",
  category: "marketing",
  summary: "Ongoing testing across channels and funnel stages to improve what actually converts.",
  icon: "rocket",
  order: 8,
  status: "published",
  covers: [
    {
      name: "Growth Marketing",
      benefit: "Continuous testing across channels and funnel stages, not a one-time campaign.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "Growth Marketing: Continuous Testing, Measurable Results",
    intro:
      "Marketing treated as an ongoing cycle of testing and measurement across channels and funnel stages, so what works gets more budget and what doesn't gets changed.",
  },
  problem: {
    heading: "Why marketing activity stalls",
    points: [
      {
        title: "Channels run in isolation",
        description: "Social, ads, SEO and email each run their own way with no shared view of what drives results.",
      },
      {
        title: "No testing, just repetition",
        description: "The same campaigns run month after month without checking whether a different approach would do better.",
      },
      {
        title: "The funnel has a weak link no one's found",
        description: "Traffic grows but enquiries don't, because the drop-off is happening somewhere no one is measuring.",
      },
    ],
  },
  approach: {
    heading: "How we run growth marketing",
    body: [
      "We map your funnel from first visit to closed enquiry and find where the real drop-off is happening, then prioritize tests across channels, pages and offers based on where the impact will be largest.",
      "Each test is measured against a clear metric, not a feeling. What moves the number keeps running and gets more budget; what doesn't is changed or dropped, and the cycle repeats.",
    ],
  },
  features: [
    {
      title: "Funnel mapping",
      description: "See the full path from first visit to closed enquiry, and where it leaks.",
    },
    {
      title: "Cross-channel coordination",
      description: "Social, ads, SEO and email tested and measured as one connected system.",
    },
    {
      title: "Structured experimentation",
      description: "Tests prioritized by likely impact, run against a clear metric.",
    },
    {
      title: "Conversion rate optimization",
      description: "Landing pages and offers improved based on what visitors actually do.",
    },
    {
      title: "Growth reporting",
      description: "Clear view of what's working, what changed, and what's next.",
    },
  ],
  outcomes: [
    {
      title: "Find the real bottleneck",
      description: "Effort goes toward the funnel stage that's actually limiting growth.",
    },
    {
      title: "Improve what you already have",
      description: "Existing traffic and spend convert better before new budget is added.",
    },
    {
      title: "Decisions based on results",
      description: "What keeps running is what the numbers show is working.",
    },
  ],
  benefits: [
    {
      title: "Growth without just spending more",
      description: "Better conversion at each stage means more from the same traffic.",
    },
    {
      title: "Channels that reinforce each other",
      description: "Social, ads, SEO and email tested and coordinated, not run in isolation.",
    },
    {
      title: "A repeatable process",
      description: "Testing becomes a routine, not a one-off project that stops after launch.",
    },
  ],
  useCases: [
    "Funnel and drop-off analysis",
    "Landing page and offer testing",
    "Cross-channel campaign coordination",
    "Ongoing conversion rate optimization",
  ],
  industries: ["real-estate", "retail", "travel", "healthcare"],
  projects: [],
  faqs: [
    {
      question: "How is growth marketing different from running campaigns?",
      answer:
        "Campaigns are planned and launched once. Growth marketing treats marketing as an ongoing cycle: test, measure, keep what works, change what doesn't, across every channel and funnel stage.",
    },
    {
      question: "Do I need a large budget to start?",
      answer:
        "No. Growth marketing often starts by improving what you already have, like conversion rates on existing traffic, before recommending additional spend.",
    },
    {
      question: "What counts as a funnel stage?",
      answer:
        "Any step between a first visit and a closed enquiry: landing on a page, filling a form, getting a reply, and following up. We map yours specifically rather than assuming a generic funnel.",
    },
    {
      question: "How do you decide what to test first?",
      answer:
        "We prioritize by where the data shows the biggest drop-off, so effort goes to the stage most likely to move results, not whichever idea comes up first.",
    },
  ],
  seo: {
    title: "Growth Marketing: Funnel Testing and Optimization",
    description:
      "Growth marketing with funnel mapping, cross-channel coordination, structured experimentation and conversion rate optimization for measurable results.",
  },
};

/**
 * Home page copy (spec FR-010 to FR-020). Verbatim strings come from the
 * approved specification; section intros are drafts pending U Design review (T222).
 */
export const home = {
  hero: {
    eyebrow: "Build. Market. Grow.",
    headline: "Digital Solutions That Help Businesses Grow",
    lead: "We build custom software, dashboards and automation systems while helping businesses grow through digital marketing and performance-driven advertising.",
    primaryCta: { label: "Get Free Consultation", href: "/contact#consultation" },
    secondaryCta: { label: "View Our Solutions", href: "/solutions" },
  },
  trust: {
    heading: "Trusted by Growing Businesses",
  },
  services: {
    eyebrow: "What we do",
    heading: "Two capabilities. One digital growth partner.",
    intro:
      "We build the systems that run your operations and the marketing that brings in new business, so both work towards the same goals.",
    software: {
      heading: "Business Software & Digital Solutions",
      intro: "Systems designed around how your business actually works.",
      digitalization: {
        name: "Business Process Digitalization",
        benefit:
          "Move paper forms, spreadsheets and message-based approvals into structured digital workflows.",
        href: "#digitalization",
      },
    },
    marketing: {
      heading: "Digital Marketing & Growth",
      intro: "Visibility and enquiries from the channels your customers use.",
    },
    closing:
      "Build. Market. Grow. Software and marketing under one roof, working towards the same results.",
  },
  industries: {
    eyebrow: "Industries",
    heading: "Built around the way your industry works",
    intro:
      "Every industry has its own workflows, documents and reports. We adapt each solution to the specific way your business operates.",
    allLink: "Explore all industries",
  },
  projects: {
    eyebrow: "Software showcase",
    heading: "Practical business systems, designed around real workflows",
    intro:
      "Concept systems that show how we approach common business operations: the modules, the workflow and how management gains visibility.",
    allLink: "View the portfolio",
  },
  process: {
    eyebrow: "How we work",
    heading: "How We Work",
    intro:
      "A clear, step-by-step process, so you always know what happens next and what we need from you.",
  },
  marketing: {
    eyebrow: "Digital marketing",
    heading: "Don't Just Build Your Business. Grow It.",
    intro:
      "Strong systems need a steady flow of customers. We help you improve your digital presence and turn attention into enquiries.",
    items: [
      {
        name: "Social Media Marketing",
        icon: "share",
        benefit:
          "A consistent, professional presence where your customers and partners spend time.",
      },
      {
        name: "Content Creation",
        icon: "pen-line",
        benefit: "Posts, visuals and videos that explain what you do in plain business language.",
      },
      {
        name: "Meta Ads",
        icon: "target",
        benefit: "Facebook and Instagram campaigns focused on the audiences that matter to you.",
      },
      {
        name: "Lead Generation",
        icon: "trending-up",
        benefit: "Campaigns and landing pages designed to turn interest into enquiries.",
      },
      {
        name: "Performance Tracking",
        icon: "chart-line",
        benefit: "Clear reporting on what each campaign delivers, so budget goes where it works.",
      },
      {
        name: "Digital Strategy",
        icon: "compass",
        benefit: "A practical plan that connects marketing activity to your business goals.",
      },
    ],
    outcomes: [
      "Reaching the right audience",
      "Building brand visibility",
      "Generating leads",
      "Improving digital presence",
      "Supporting business growth",
    ],
    cta: { label: "Grow Your Business", href: "/digital-marketing" },
  },
  why: {
    eyebrow: "Why U Design",
    heading: "Why U Design",
    intro: "A partner that understands the business first and the technology second.",
  },
  finalCta: {
    heading: "Ready to digitalize and grow your business?",
    text: "Tell us how your business works today and where you want it to be. We will suggest a practical way forward in a free consultation.",
  },
} as const;

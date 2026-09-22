import type { Solution } from "@/types/content";

export const customSoftware: Solution = {
  slug: "custom-software",
  name: "Custom Software",
  category: "software",
  summary:
    "Business-specific software designed around your actual workflows, not a generic template.",
  icon: "code",
  order: 1,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Custom Business Software Built Around How You Work",
    intro:
      "When off-the-shelf tools force your team into workarounds, we build software that fits your real workflow — so operations run smoothly, data stays in one place and management can see what is happening.",
  },
  problem: {
    heading: "When generic tools and spreadsheets hold the business back",
    points: [
      {
        title: "Workarounds everywhere",
        description:
          "Teams export data to Excel, re-type it into other systems and keep side lists to cover gaps their software cannot handle.",
      },
      {
        title: "Disconnected information",
        description:
          "Sales, operations and accounts each keep their own version of the truth, so a simple question can take hours to answer.",
      },
      {
        title: "Processes that live in people's heads",
        description:
          "Approvals, follow-ups and handovers depend on WhatsApp messages and memory instead of a reliable system.",
      },
      {
        title: "Software that does not fit",
        description:
          "Ready-made products either miss steps that matter to your process or add complexity your team does not need.",
      },
    ],
  },
  approach: {
    heading: "How custom software helps",
    body: [
      "We start by mapping how work actually moves through your business: who does what, which documents change hands and where delays happen. The software is then designed around that workflow instead of forcing your team to adapt to a generic product.",
      "The result is one system that replaces scattered spreadsheets and manual steps, gives each role the screens it needs and keeps data consistent from the first entry to the final report. Because it is built for your business, it can grow with new branches, products and processes.",
    ],
  },
  features: [
    {
      title: "Workflow-based design",
      description:
        "Screens and steps follow the way your team already works, which makes adoption easier.",
    },
    {
      title: "Business process digitalization",
      description:
        "Turn paper forms, spreadsheets and message-based approvals into structured digital workflows.",
    },
    {
      title: "Role-based access",
      description:
        "Each person sees the information and actions relevant to their role, with the right permissions.",
    },
    {
      title: "One central database",
      description:
        "A single source of data for operations, sales and management instead of duplicate spreadsheets.",
    },
    {
      title: "Reports and dashboards",
      description: "Management views built on live data rather than reports compiled by hand.",
    },
    {
      title: "Ready to connect",
      description:
        "Link with the accounting, communication or e-commerce tools you already use where they offer integration options.",
    },
  ],
  benefits: [
    {
      title: "Less manual work",
      description:
        "Remove repeated data entry and hand-offs between spreadsheets, email and messages.",
    },
    {
      title: "Fewer errors",
      description:
        "Validation and a single source of data reduce the mistakes caused by copying information.",
    },
    {
      title: "Clear visibility",
      description:
        "Owners and managers see status, bottlenecks and performance without waiting for reports.",
    },
    {
      title: "Room to grow",
      description:
        "Add modules, users and locations as the business expands, without starting again.",
    },
  ],
  useCases: [
    "Order and job management",
    "Approval workflows",
    "Field and service operations",
    "Customer and supplier portals",
    "Internal management systems",
  ],
  industries: [
    "manufacturing",
    "distribution",
    "construction",
    "logistics",
    "travel",
    "healthcare",
    "real-estate",
  ],
  projects: ["travel-agency-management"],
  faqs: [
    {
      question: "What is custom software development?",
      answer:
        "Custom software development means building an application around how your business actually works, instead of adapting your business to fit an off-the-shelf product. It replaces spreadsheets, disconnected tools and manual workarounds with one system built for your workflow.",
    },
    {
      question: "How is custom software different from an off-the-shelf product?",
      answer:
        "An off-the-shelf product is built for many businesses at once, so it covers common cases but often misses the specific steps your business relies on. Custom software is designed around your actual processes, data and reporting needs from the start.",
    },
    {
      question: "Do you build custom software for any industry?",
      answer:
        "We build for the industries we understand best, including manufacturing, distribution, construction, logistics, travel, healthcare and real estate, adapting each system to how that specific industry operates.",
    },
    {
      question: "Can custom software replace our spreadsheets and manual processes?",
      answer:
        "Yes. A common starting point is moving paper forms, spreadsheets and message-based approvals into a structured digital workflow, so data lives in one place and management has real visibility.",
    },
  ],
  seo: {
    title: "Custom Software Development for Businesses",
    description:
      "Custom business software development built around your workflow. Replace spreadsheets and disconnected tools with one system your team can rely on.",
  },
};

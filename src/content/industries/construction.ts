import type { Industry } from "@/types/content";

export const construction: Industry = {
  slug: "construction",
  name: "Construction",
  shortWorkflows: ["Projects", "Procurement", "Materials", "Expenses", "Progress"],
  summary:
    "Control project costs, material procurement and site progress across every active project.",
  icon: "hard-hat",
  priority: 4,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Construction Companies",
    intro:
      "See the cost, materials and progress of every project in one place, so site teams, procurement and management make decisions from the same information.",
  },
  challenges: [
    {
      title: "Project costs known only at the end",
      description:
        "Expenses are recorded in different places, so the real cost of a project is unclear until it is too late to act.",
    },
    {
      title: "Material requests from site are informal",
      description:
        "Site engineers request materials by phone or message, and procurement struggles to prioritize them.",
    },
    {
      title: "Progress reported by photos and calls",
      description:
        "Management cannot compare actual progress against the plan without visiting the site.",
    },
    {
      title: "Subcontractor work is hard to track",
      description: "Work orders, measurements and payments to subcontractors are managed on paper.",
    },
  ],
  workflows: [
    {
      name: "Projects",
      description: "Set up projects with budgets, phases and responsible teams.",
    },
    {
      name: "Procurement",
      description: "Turn site requests into approved purchase orders with delivery tracking.",
    },
    { name: "Materials", description: "Record materials received and used at each site." },
    {
      name: "Expenses",
      description: "Capture labour, equipment and site expenses against the right project.",
    },
    {
      name: "Progress",
      description: "Record progress against planned activities with site updates.",
    },
  ],
  solutions: ["custom-software", "erp", "automation"],
  features: [
    {
      title: "Budget versus actual",
      description: "Compare spending with the approved budget for each project and phase.",
    },
    {
      title: "Site material requests",
      description: "Structured requests from site with approval and delivery status.",
    },
    {
      title: "Subcontractor work orders",
      description: "Issue work orders, record measurements and track payments owed.",
    },
    {
      title: "Progress updates",
      description: "Site teams submit progress and photos against planned activities.",
    },
  ],
  benefits: [
    {
      title: "Early warning on costs",
      description: "Overruns become visible while there is still time to respond.",
    },
    {
      title: "Fewer site delays",
      description: "Materials are requested, approved and delivered through a clear process.",
    },
    {
      title: "Oversight without site visits",
      description: "Management can review every project's status from one dashboard.",
    },
  ],
  projects: [],
  seo: {
    title: "Construction Project and Procurement Software",
    description:
      "Construction software for project budgets, site material requests, procurement, expenses and progress tracking across every active project.",
  },
};

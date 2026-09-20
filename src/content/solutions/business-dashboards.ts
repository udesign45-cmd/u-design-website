import type { Solution } from "@/types/content";

export const businessDashboards: Solution = {
  slug: "business-dashboards",
  name: "Business Dashboards",
  category: "software",
  summary: "Real-time business visibility and reporting for owners and managers.",
  icon: "layout-dashboard",
  order: 4,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Business Dashboards That Show What Is Happening Now",
    intro:
      "Replace manually compiled reports with live dashboards that bring the key figures from across your business into one clear view.",
  },
  problem: {
    heading: "When reporting slows decisions down",
    points: [
      {
        title: "Reports built by hand",
        description:
          "Staff spend hours each week copying figures from different systems into spreadsheets before anyone can review them.",
      },
      {
        title: "Numbers that are already out of date",
        description:
          "By the time a report reaches management, the situation it describes has changed.",
      },
      {
        title: "No single view of the business",
        description:
          "Sales, production, stock and finance figures sit in separate places with different definitions.",
      },
    ],
  },
  approach: {
    heading: "How dashboards help",
    body: [
      "We start with the decisions you need to make and the figures behind them. We then connect the relevant data sources and present them in dashboards designed for each audience, from the owner's summary to a department manager's daily view.",
      "Where data is still captured on paper or in spreadsheets, we can combine dashboards with simple data-entry screens so the numbers you rely on are complete and consistent.",
    ],
  },
  features: [
    {
      title: "Key figures at a glance",
      description:
        "Summaries of the measures that matter most to your business on a single screen.",
    },
    {
      title: "Drill-down detail",
      description: "Move from a headline figure to the orders, products or teams behind it.",
    },
    {
      title: "Role-specific views",
      description: "Different dashboards for owners, department heads and operational teams.",
    },
    {
      title: "Data from several sources",
      description: "Combine information from your existing systems and spreadsheets into one view.",
    },
    {
      title: "Exception highlights",
      description: "Make overdue orders, low stock or targets at risk visible early.",
    },
    {
      title: "Shareable reports",
      description: "Export or schedule reports for meetings, partners and management reviews.",
    },
  ],
  benefits: [
    {
      title: "Faster decisions",
      description: "Act on current information rather than waiting for monthly reports.",
    },
    {
      title: "Less reporting effort",
      description: "Free your team from repetitive report preparation.",
    },
    {
      title: "One shared picture",
      description: "Everyone discusses the same figures, defined the same way.",
    },
  ],
  useCases: [
    "Executive and owner dashboards",
    "Production monitoring",
    "Sales performance tracking",
    "Inventory and stock status",
  ],
  industries: ["manufacturing", "distribution", "retail", "logistics", "real-estate"],
  projects: ["manufacturing-erp"],
  seo: {
    title: "Business Dashboard Development and Reporting",
    description:
      "Business dashboard development that turns data from sales, operations and finance into clear, real-time views for owners and managers.",
  },
};

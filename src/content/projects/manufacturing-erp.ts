import type { Project } from "@/types/content";
import { pendingScreenshots } from "./pending";

/** Concept/demo project (research R-3): no client name, no results. */
export const manufacturingErp: Project = {
  slug: "manufacturing-erp",
  title: "Manufacturing ERP",
  type: "concept",
  industry: "manufacturing",
  industryLabel: "Textile Manufacturing",
  solutionTypes: ["erp", "business-dashboards"],
  summary:
    "A concept ERP showing how a textile manufacturer can centralize production, inventory, purchasing and sales, and give management visibility across the business.",
  modules: [
    {
      name: "Executive Dashboard",
      description: "Production, orders, stock and sales summarised for owners and directors.",
    },
    {
      name: "Production",
      description: "Production orders followed through each stage, from yarn to finished goods.",
    },
    {
      name: "Inventory",
      description: "Raw materials, work in progress and finished goods tracked by location.",
    },
    {
      name: "Purchase",
      description: "Purchase requests, approvals, orders and goods received in one flow.",
    },
    {
      name: "Sales",
      description: "Customer orders, dispatch status and delivery records.",
    },
    {
      name: "Reports",
      description: "Output, stock movement and sales reports generated from recorded data.",
    },
  ],
  challenge: [
    "A typical textile manufacturer runs production planning, yarn and fabric stock, purchasing and customer orders in separate spreadsheets. Supervisors report progress by phone, stock is counted manually and management relies on reports that are several days old.",
    "The result is avoidable material shortages, orders that slip without warning and little visibility for the people responsible for the business.",
  ],
  solution: [
    "This concept brings the core manufacturing workflows into one ERP. Customer orders feed production planning, production consumes materials from inventory, and low stock triggers purchase requests that follow an approval process.",
    "Each module is designed around the way a textile unit actually works, and an executive dashboard summarises the whole operation in one place.",
  ],
  businessApplication: [
    "The same structure applies to many manufacturers, including packaging, plastics, food, chemicals and engineering businesses. Stages, units and reports are adapted to each company's products and processes.",
    "For management, the main change is visibility: knowing what is being produced, what is in stock and which orders need attention without waiting for someone to compile a report.",
  ],
  screenshots: pendingScreenshots([
    "Executive Dashboard",
    "Production",
    "Inventory",
    "Purchase",
    "Sales",
    "Reports",
  ]),
  featured: true,
  status: "published",
  seo: {
    title: "Manufacturing ERP Concept for Textile Producers",
    description:
      "A concept manufacturing ERP for textile production: executive dashboard, production, inventory, purchasing, sales and reports in one connected system.",
  },
};

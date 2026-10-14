import type { Industry } from "@/types/content";

export const textile: Industry = {
  slug: "textile",
  name: "Textile",
  shortWorkflows: ["Production", "Inventory", "Orders", "Quality", "Reporting"],
  summary: "Connect production, raw material stock, orders and quality checks across every stage.",
  icon: "shirt",
  priority: 9,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Textile and Garment Businesses",
    intro:
      "Track raw materials, production stages, orders and quality from one system, so nothing is lost between spinning, weaving, dyeing, cutting and stitching.",
  },
  challenges: [
    {
      title: "Production stages tracked on paper",
      description:
        "Batches move through spinning, dyeing and stitching with no shared record of where each order stands.",
    },
    {
      title: "Raw material stock is unclear",
      description:
        "Yarn, fabric and trims are reordered late or over-ordered because stock levels are not visible centrally.",
    },
    {
      title: "Order status is hard to answer",
      description:
        "Buyers ask where their order stands and the answer means calling the floor to check.",
    },
    {
      title: "Quality issues surface too late",
      description:
        "Defects found at the final stage mean rework or rejected batches that could have been caught earlier.",
    },
  ],
  workflows: [
    {
      name: "Production",
      description: "Track each batch through spinning, dyeing, cutting and stitching stages.",
    },
    {
      name: "Inventory",
      description: "See raw material and finished goods stock, with reorder points for key inputs.",
    },
    {
      name: "Orders",
      description: "Manage buyer orders, quantities and delivery dates in one place.",
    },
    {
      name: "Quality",
      description: "Record inspection results at each stage, not only at the end of the line.",
    },
    {
      name: "Reporting",
      description: "See production output, stock and order status without visiting the floor.",
    },
  ],
  solutions: ["erp", "business-dashboards", "automation", "website-development"],
  features: [
    {
      title: "Stage-by-stage tracking",
      description: "Every batch's progress visible from raw material to finished goods.",
    },
    {
      title: "Raw material stock control",
      description: "Yarn, fabric and trim stock with reorder points based on usage.",
    },
    {
      title: "Order and buyer management",
      description: "Orders, quantities and delivery dates tracked against production status.",
    },
    {
      title: "Quality checkpoints",
      description: "Inspection results recorded at each production stage, not just the last one.",
    },
  ],
  benefits: [
    {
      title: "Clear order status",
      description: "Answer where an order stands without walking the production floor.",
    },
    {
      title: "Fewer material shortages",
      description: "Raw material reordering based on actual usage and stock levels.",
    },
    {
      title: "Issues caught earlier",
      description: "Quality checks at each stage reduce rework and rejected batches.",
    },
  ],
  projects: [],
  seo: {
    title: "Textile and Garment Production Management Software",
    description:
      "Textile and garment software that tracks production stages, raw material stock, buyer orders and quality checks in one connected system.",
  },
};

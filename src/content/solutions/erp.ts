import type { Solution } from "@/types/content";

export const erp: Solution = {
  slug: "erp",
  name: "ERP Systems",
  category: "software",
  summary:
    "Centralized management for operations, inventory, production, purchasing, sales and reporting.",
  icon: "layers",
  order: 2,
  status: "published",
  hasPage: true,
  hero: {
    heading: "ERP Systems That Connect Your Entire Operation",
    intro:
      "Bring production, inventory, purchasing, sales and reporting into one system designed around your processes, so every department works from the same accurate information.",
  },
  problem: {
    heading: "Signs your operation has outgrown its current tools",
    points: [
      {
        title: "Stock figures you cannot trust",
        description:
          "Inventory numbers differ between the warehouse, sales and accounts, which leads to shortages, excess stock and missed orders.",
      },
      {
        title: "Production planned on spreadsheets",
        description:
          "Plans are rebuilt by hand whenever an order changes, and progress on the floor is hard to follow.",
      },
      {
        title: "Slow, informal purchasing",
        description:
          "Purchase requests, approvals and supplier follow-ups travel through email and messages with no clear status.",
      },
      {
        title: "Reports that take days",
        description:
          "Month-end and management reports are compiled manually from several disconnected sources.",
      },
    ],
  },
  approach: {
    heading: "How an ERP helps",
    body: [
      "An ERP connects the departments that depend on each other. When a sales order is confirmed, production, inventory and purchasing can see it straight away; when material is consumed, stock updates without anyone re-entering it.",
      "We design the ERP around your products, units of measure, approval steps and reporting needs, and roll it out module by module so operations continue while your team adopts the new system.",
    ],
  },
  features: [
    {
      title: "Production planning",
      description:
        "Plan orders, track work in progress and record output against each production stage.",
    },
    {
      title: "Inventory and warehouse",
      description:
        "Track raw materials, work in progress and finished goods across locations in real time.",
    },
    {
      title: "Purchasing and suppliers",
      description: "Manage purchase requests, approvals, orders and goods received in one place.",
    },
    {
      title: "Sales and orders",
      description:
        "Record quotations, orders and deliveries with a clear status for every customer order.",
    },
    {
      title: "Management reports",
      description:
        "Dashboards and reports built on live data from every module, not assembled by hand.",
    },
    {
      title: "Roles and approvals",
      description: "Control who can view, create and approve each type of transaction.",
    },
  ],
  benefits: [
    {
      title: "One source of truth",
      description:
        "Every department works from the same figures, which removes disputes about whose numbers are right.",
    },
    {
      title: "Better control of stock and cost",
      description:
        "See what you have, what is committed and what needs to be purchased before it becomes urgent.",
    },
    {
      title: "Faster, better-informed decisions",
      description:
        "Management sees current performance across the business without waiting for month-end.",
    },
    {
      title: "A foundation that scales",
      description: "Add modules, users, branches and warehouses as the business grows.",
    },
  ],
  useCases: [
    "Manufacturing operations",
    "Multi-warehouse distribution",
    "Retail stock and purchasing",
    "Project-based procurement",
  ],
  industries: ["manufacturing", "distribution", "retail", "construction"],
  projects: ["manufacturing-erp"],
  seo: {
    title: "Custom ERP Development for Growing Businesses",
    description:
      "Custom ERP software that connects production, inventory, purchasing, sales and reporting, designed around your processes, including manufacturing ERP.",
  },
};

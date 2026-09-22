import type { Industry } from "@/types/content";

export const manufacturing: Industry = {
  slug: "manufacturing",
  name: "Manufacturing",
  shortWorkflows: ["Production", "Inventory", "Purchasing", "Sales", "Operations", "Reporting"],
  summary:
    "Connect production, raw materials, purchasing, sales and reporting so management can see the whole factory in one place.",
  icon: "factory",
  priority: 1,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Manufacturing Businesses",
    intro:
      "From raw material to dispatch, bring production, inventory, purchasing, sales and reporting into one system built around how your factory actually runs — whether you produce textiles, packaging, automotive parts, food, pharmaceuticals, plastics, chemicals or engineered products.",
  },
  challenges: [
    {
      title: "Production planned on spreadsheets",
      description:
        "Production plans live in Excel files that are rebuilt whenever an order changes, and supervisors report progress by phone or WhatsApp.",
    },
    {
      title: "Raw material shortages discovered too late",
      description:
        "Without an accurate view of stock and consumption, materials run out mid-run or excess stock ties up working capital.",
    },
    {
      title: "Purchasing disconnected from demand",
      description:
        "Purchase requests are raised informally and are not linked to confirmed orders or planned production.",
    },
    {
      title: "Management waits days for reports",
      description:
        "Output, wastage, order status and sales figures are collected manually from different departments before anyone can act on them.",
    },
  ],
  workflows: [
    {
      name: "Production management",
      description:
        "Plan production orders, assign machines and shifts, and record output at each stage.",
    },
    {
      name: "Inventory",
      description:
        "Track stock of materials, work in progress and finished goods across stores and locations.",
    },
    {
      name: "Raw materials",
      description:
        "Record receipts, issues to production and consumption so material usage is visible.",
    },
    {
      name: "Purchasing",
      description:
        "Link purchase requests to demand, manage approvals, orders and supplier deliveries.",
    },
    {
      name: "Sales",
      description: "Manage quotations, customer orders and dispatch status from one screen.",
    },
    {
      name: "Warehouse",
      description: "Organize storage locations, goods received, transfers and dispatches.",
    },
    {
      name: "Reporting",
      description:
        "Produce output, wastage, stock and sales reports from recorded data instead of spreadsheets.",
    },
    {
      name: "Management dashboards",
      description: "Give owners and directors a live view of production, orders and stock.",
    },
  ],
  solutions: ["erp", "business-dashboards", "custom-software", "automation", "website-development"],
  features: [
    {
      title: "Production orders and stages",
      description:
        "Follow each order from planning to completion, with output and rejects recorded per stage.",
    },
    {
      title: "Bill of materials",
      description:
        "Define the materials each product needs so consumption and requirements are calculated.",
    },
    {
      title: "Stock by location",
      description: "Know what is in each store, on the floor and ready for dispatch.",
    },
    {
      title: "Purchase approvals",
      description:
        "Approve requests and orders with clear responsibility and a record of every decision.",
    },
    {
      title: "Order-to-dispatch tracking",
      description: "See where every customer order stands and what is holding it back.",
    },
    {
      title: "Executive dashboard",
      description: "Production, stock, purchasing and sales summarised for management in one view.",
    },
  ],
  benefits: [
    {
      title: "Visibility across the factory",
      description:
        "Management can see production, stock and orders without chasing each department.",
    },
    {
      title: "Better material planning",
      description:
        "Purchasing is driven by real demand and stock levels, reducing shortages and excess.",
    },
    {
      title: "Less manual reporting",
      description: "Reports are generated from recorded transactions rather than compiled by hand.",
    },
    {
      title: "Accountability at every stage",
      description:
        "Each step is recorded with who did what and when, which makes problems easier to trace.",
    },
  ],
  projects: ["manufacturing-erp"],
  seo: {
    title: "Manufacturing ERP and Management Software",
    description:
      "Manufacturing management software and ERP for production, raw materials, inventory, purchasing, sales and reporting, built around how your factory works.",
  },
};

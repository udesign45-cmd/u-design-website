import type { Industry } from "@/types/content";

export const distribution: Industry = {
  slug: "distribution",
  name: "Distribution",
  shortWorkflows: ["Sales", "Inventory", "Warehouses", "Orders", "Customers", "Reporting"],
  summary:
    "Manage orders, stock across warehouses, customer accounts and deliveries with one connected system.",
  icon: "boxes",
  priority: 2,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Distribution Businesses",
    intro:
      "Keep orders, warehouse stock, customer accounts and deliveries in step, so your sales team can promise with confidence and your warehouse can fulfil on time.",
  },
  challenges: [
    {
      title: "Sales promises stock that is not there",
      description:
        "Salespeople check availability by phone or old spreadsheets, so orders are accepted for items that are already allocated.",
    },
    {
      title: "Several warehouses, several versions of stock",
      description:
        "Each location keeps its own records, and transfers between them are not tracked reliably.",
    },
    {
      title: "Order status requires phone calls",
      description:
        "Customers and sales staff call the warehouse to ask whether an order has been picked, packed or dispatched.",
    },
    {
      title: "Credit and outstanding balances are unclear",
      description:
        "Customer balances are kept separately from orders, so new orders are released without a credit check.",
    },
  ],
  workflows: [
    {
      name: "Sales",
      description: "Record quotations and orders from sales teams, dealers and key accounts.",
    },
    {
      name: "Inventory",
      description: "Maintain accurate available, reserved and incoming stock for each product.",
    },
    {
      name: "Warehouses",
      description: "Manage receiving, storage, transfers, picking and dispatch at each location.",
    },
    {
      name: "Orders",
      description: "Follow every order from entry to delivery with a visible status.",
    },
    {
      name: "Customers",
      description: "Keep customer accounts, price lists, balances and order history together.",
    },
    {
      name: "Reporting",
      description: "Analyse sales by product, customer, region and salesperson.",
    },
  ],
  solutions: ["erp", "crm", "business-dashboards", "automation", "custom-software"],
  features: [
    {
      title: "Available-to-promise stock",
      description: "Show sales teams what can actually be sold after existing orders are reserved.",
    },
    {
      title: "Multi-warehouse transfers",
      description:
        "Move stock between locations with a record of what left, what arrived and when.",
    },
    {
      title: "Pick, pack and dispatch",
      description: "Warehouse screens that follow each order through fulfilment.",
    },
    {
      title: "Customer price lists and balances",
      description:
        "Apply the right prices and check outstanding balances before orders are released.",
    },
    {
      title: "Dealer and field sales orders",
      description: "Let field teams place orders against live stock instead of calling the office.",
    },
  ],
  benefits: [
    {
      title: "Reliable delivery promises",
      description:
        "Orders are accepted against real availability, which reduces back-orders and cancellations.",
    },
    {
      title: "Faster fulfilment",
      description: "Warehouse teams work from clear, prioritized order lists.",
    },
    {
      title: "Better control of receivables",
      description: "Credit checks happen as part of the order process, not after dispatch.",
    },
  ],
  projects: [],
  seo: {
    title: "Distribution Management and Inventory Software",
    description:
      "Distribution software for orders, multi-warehouse inventory, dispatch and customer accounts, so sales and warehouse teams work from the same stock.",
  },
};

import type { Industry } from "@/types/content";

export const restaurants: Industry = {
  slug: "restaurants",
  name: "Restaurants",
  shortWorkflows: ["Orders", "Menu", "Customers", "Inventory", "Reporting"],
  summary: "Connect orders, menu, customers and stock so every location runs the same way.",
  icon: "chef-hat",
  priority: 10,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Restaurants and Food Businesses",
    intro:
      "Manage orders, menu pricing, customer records and ingredient stock from one system, so every branch works the same way and nothing is tracked on paper.",
  },
  challenges: [
    {
      title: "Menu and pricing updated separately everywhere",
      description:
        "A price or menu change has to be repeated across the till, delivery platforms and printed menus.",
    },
    {
      title: "Ingredient stock tracked by habit",
      description:
        "Reordering happens when someone notices stock is low, not from any record of actual usage.",
    },
    {
      title: "Repeat customers are not recognised",
      description:
        "A regular customer is treated like a first-time visitor because there is no shared record of past orders.",
    },
    {
      title: "Sales across branches are hard to compare",
      description:
        "Daily sales are totalled per branch by hand, so comparing performance takes real effort.",
    },
  ],
  workflows: [
    {
      name: "Orders",
      description: "Record dine-in, takeaway and delivery orders in one consistent system.",
    },
    {
      name: "Menu",
      description: "Manage menu items, pricing and availability across every branch.",
    },
    {
      name: "Customers",
      description: "Keep a record of repeat customers for loyalty and targeted offers.",
    },
    {
      name: "Inventory",
      description: "Track ingredient stock and reorder points based on actual usage.",
    },
    {
      name: "Reporting",
      description: "Compare sales, popular items and stock movement across branches.",
    },
  ],
  solutions: ["crm", "business-dashboards", "website-development"],
  features: [
    {
      title: "Centralized menu management",
      description: "Update items, pricing and availability once, applied across every branch.",
    },
    {
      title: "Ingredient stock tracking",
      description: "Reorder points based on usage, not on someone noticing stock is low.",
    },
    {
      title: "Customer records",
      description: "Order history that supports loyalty programs and repeat business.",
    },
    {
      title: "Branch sales dashboard",
      description: "Daily sales and popular items compared across every location.",
    },
  ],
  benefits: [
    {
      title: "Consistent pricing everywhere",
      description: "One update reaches every branch, till and ordering channel.",
    },
    {
      title: "Fewer ingredient shortages",
      description: "Stock is reordered based on real usage, not guesswork.",
    },
    {
      title: "Stronger customer relationships",
      description: "Recognising repeat customers makes loyalty and offers possible.",
    },
  ],
  projects: [],
  seo: {
    title: "Restaurant Management Software for Orders and Menus",
    description:
      "Restaurant software that connects orders, menu pricing, customer records and ingredient stock across every branch in one system.",
  },
};

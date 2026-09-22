import type { Industry } from "@/types/content";

export const retail: Industry = {
  slug: "retail",
  name: "Retail",
  shortWorkflows: ["Products", "Inventory", "Sales", "Customers", "Reporting"],
  summary: "Keep products, branch stock, sales and customer data connected across every store.",
  icon: "shopping-bag",
  priority: 8,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Retail Businesses",
    intro:
      "Manage products, stock across branches, sales and customers from one system, so you know what is selling, what to reorder and where stock should move.",
  },
  challenges: [
    {
      title: "Branch stock out of sync",
      description:
        "One store runs out while another has surplus, because stock is not visible across branches.",
    },
    {
      title: "Reordering based on guesswork",
      description:
        "Purchase decisions are made without clear sales history for each product and size.",
    },
    {
      title: "Customer information not captured",
      description:
        "Repeat customers are unknown to the business, so loyalty and targeted offers are difficult.",
    },
    {
      title: "Sales figures compiled from each store",
      description: "Daily sales are collected from branches by message and combined manually.",
    },
  ],
  workflows: [
    { name: "Products", description: "Maintain the catalogue with variants, prices and barcodes." },
    {
      name: "Inventory",
      description: "See stock by branch and warehouse, with transfers between them.",
    },
    { name: "Sales", description: "Record sales and returns consistently across stores." },
    { name: "Customers", description: "Build customer profiles and purchase history." },
    {
      name: "Reporting",
      description: "Compare sales, margins and stock movement by branch and product.",
    },
  ],
  solutions: ["erp", "crm", "business-dashboards", "website-development"],
  features: [
    {
      title: "Stock by branch",
      description: "Every store's stock visible centrally, with suggested transfers.",
    },
    {
      title: "Reorder suggestions",
      description: "Reorder points based on sales history and current stock.",
    },
    {
      title: "Customer profiles",
      description: "Purchase history that supports loyalty and targeted campaigns.",
    },
    {
      title: "Branch performance dashboard",
      description: "Daily sales and stock movement for each branch in one view.",
    },
  ],
  benefits: [
    {
      title: "Fewer stock-outs",
      description: "Stock is moved or reordered before popular items run out.",
    },
    {
      title: "Smarter purchasing",
      description: "Buying decisions are based on what actually sells.",
    },
    {
      title: "Closer customer relationships",
      description: "Knowing your customers makes marketing more relevant.",
    },
  ],
  projects: [],
  seo: {
    title: "Retail Inventory and Sales Management Software",
    description:
      "Retail software that connects products, branch inventory, sales and customers, so you know what is selling and what to reorder in every store.",
  },
};

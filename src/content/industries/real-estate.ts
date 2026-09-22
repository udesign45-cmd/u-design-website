import type { Industry } from "@/types/content";

export const realEstate: Industry = {
  slug: "real-estate",
  name: "Real Estate",
  shortWorkflows: ["Leads", "Properties", "Sales", "Bookings", "Customers", "Payments"],
  summary:
    "Track leads, property inventory, site visits, bookings and installment payments in one CRM built for property sales.",
  icon: "building",
  priority: 3,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Real Estate Businesses",
    intro:
      "From the first enquiry to the final installment, manage leads, units, site visits, bookings and payments in one place, so no buyer and no payment is overlooked.",
  },
  challenges: [
    {
      title: "Enquiries from many portals and campaigns",
      description:
        "Leads arrive from property portals, social media ads, calls and walk-ins, and many are never followed up.",
    },
    {
      title: "Unit availability kept in spreadsheets",
      description: "Sales staff are not sure which units are available, on hold or already booked.",
    },
    {
      title: "Site visits that are not followed up",
      description:
        "Visits are arranged by phone and the outcome is rarely recorded against the buyer.",
    },
    {
      title: "Installment tracking done by hand",
      description:
        "Payment schedules, receipts and overdue installments are tracked in separate files, which makes collection slow.",
    },
  ],
  workflows: [
    {
      name: "Leads",
      description: "Capture and assign enquiries from every source with follow-up tasks.",
    },
    {
      name: "Properties",
      description: "Maintain projects, blocks and units with price, size and availability.",
    },
    { name: "Site visits", description: "Schedule visits and record feedback against each buyer." },
    {
      name: "Bookings",
      description: "Hold, book and allocate units with the documents that go with them.",
    },
    {
      name: "Customers",
      description: "Keep every buyer's history, documents and communication together.",
    },
    {
      name: "Payments",
      description: "Track installment plans, receipts and overdue amounts per unit.",
    },
  ],
  solutions: ["crm", "business-dashboards", "custom-software", "website-development"],
  features: [
    {
      title: "Lead source tracking",
      description: "See which portals and campaigns bring enquiries that turn into bookings.",
    },
    {
      title: "Live unit inventory",
      description: "Available, held and booked units visible to the whole sales team.",
    },
    {
      title: "Installment schedules",
      description: "Generate payment plans per booking and see what is due and overdue.",
    },
    {
      title: "Sales team dashboard",
      description: "Visits, bookings and collections by salesperson and project.",
    },
  ],
  benefits: [
    {
      title: "More enquiries followed up",
      description: "Every lead is assigned and scheduled, so fewer potential buyers are lost.",
    },
    {
      title: "No double-booked units",
      description: "One live inventory prevents conflicts between salespeople.",
    },
    {
      title: "Faster collections",
      description: "Upcoming and overdue installments are visible and can be followed up on time.",
    },
  ],
  projects: ["real-estate-crm"],
  seo: {
    title: "Real Estate CRM and Property Sales Software",
    description:
      "Real estate CRM for leads, property inventory, site visits, bookings and installment payments, built around how your sales team works.",
  },
};

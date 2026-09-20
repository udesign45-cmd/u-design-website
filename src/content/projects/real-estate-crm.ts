import type { Project } from "@/types/content";
import { pendingScreenshots } from "./pending";

/** Concept/demo project (research R-3): no client name, no results. */
export const realEstateCrm: Project = {
  slug: "real-estate-crm",
  title: "Real Estate CRM",
  type: "concept",
  industry: "real-estate",
  industryLabel: "Real Estate",
  solutionTypes: ["crm"],
  summary:
    "A concept CRM showing how a real estate business can centralize leads, customers, properties, site visits, bookings and installment payments.",
  modules: [
    {
      name: "Dashboard",
      description: "Leads, visits, bookings and collections summarised by project.",
    },
    {
      name: "Leads",
      description: "Enquiries from portals, campaigns and walk-ins with assignment and follow-up.",
    },
    {
      name: "Customers",
      description: "Buyer profiles with documents, visits and booking history.",
    },
    {
      name: "Properties",
      description: "Projects, blocks and units with price, size and availability.",
    },
    {
      name: "Site Visits",
      description: "Scheduled visits with outcomes recorded against each buyer.",
    },
    { name: "Bookings", description: "Unit holds and bookings with the related documents." },
    {
      name: "Installments",
      description: "Payment plans, receipts and overdue installments per unit.",
    },
    {
      name: "Reports",
      description: "Sales, visits and collections by project, source and salesperson.",
    },
  ],
  challenge: [
    "Real estate sales teams handle enquiries from many portals and campaigns, keep unit availability in spreadsheets and track installment payments by hand. Follow-ups depend on individual salespeople.",
    "This leads to missed enquiries, confusion about which units are still available and slow collection of installments.",
  ],
  solution: [
    "This concept connects the full sales cycle. Leads are captured and assigned, site visits are scheduled and recorded, units are held and booked from a live inventory, and each booking generates its installment schedule.",
    "Managers see the pipeline and collections for every project from one dashboard.",
  ],
  businessApplication: [
    "The design applies to developers, builders and real estate agencies selling residential or commercial units, with stages and payment plans configured for each project.",
    "It gives sales managers control of follow-up and gives finance a reliable view of upcoming and overdue payments.",
  ],
  screenshots: pendingScreenshots([
    "Dashboard",
    "Leads",
    "Customers",
    "Properties",
    "Site Visits",
    "Bookings",
    "Installments",
    "Reports",
  ]),
  featured: true,
  status: "published",
  seo: {
    title: "Real Estate CRM Concept for Property Sales",
    description:
      "A concept real estate CRM covering leads, customers, properties, site visits, bookings, installment payments and sales reports for property teams.",
  },
};

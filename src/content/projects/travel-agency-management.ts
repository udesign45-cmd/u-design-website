import type { Project } from "@/types/content";
import { pendingScreenshots } from "./pending";

/** Concept/demo project (research R-3): no client name, no results. */
export const travelAgencyManagement: Project = {
  slug: "travel-agency-management",
  title: "Travel Agency Management",
  type: "concept",
  industry: "travel",
  industryLabel: "Travel & Tourism",
  solutionTypes: ["custom-software", "crm"],
  summary:
    "A concept system for managing a travel agency's customers, leads, packages, bookings, visa processing and payments in one place.",
  modules: [
    {
      name: "Dashboard",
      description: "Upcoming departures, open enquiries and outstanding payments at a glance.",
    },
    {
      name: "Customers",
      description: "Traveller profiles with documents, trips and communication history.",
    },
    {
      name: "Leads",
      description: "Enquiries from every channel with follow-up tasks and quotation status.",
    },
    {
      name: "Packages",
      description: "Packages built from flights, hotels, transport and activities with pricing.",
    },
    {
      name: "Bookings",
      description: "Confirmed bookings with travellers, services, dates and suppliers.",
    },
    {
      name: "Visa Processing",
      description: "Document checklists and application status for each traveller.",
    },
    {
      name: "Payments",
      description: "Advances, balances and refunds recorded against each booking.",
    },
    {
      name: "Reports",
      description: "Sales, bookings and collections by period, destination and agent.",
    },
  ],
  challenge: [
    "Travel agencies often receive most enquiries through WhatsApp and social media, prepare quotations in spreadsheets and track visa documents on paper. Payments are collected in parts and reconciled manually.",
    "As the business grows, enquiries are missed, visa deadlines become stressful and it is difficult to see the financial position of each departure.",
  ],
  solution: [
    "This concept centralizes the agency's workflow. Every enquiry becomes a lead with follow-up tasks; accepted quotations become bookings; each traveller has a visa checklist; and every payment is recorded against its booking.",
    "A dashboard shows departures, pending documents and outstanding balances, so the team can act before problems reach the customer.",
  ],
  businessApplication: [
    "The structure suits travel agencies, tour operators and umrah and visa service providers, with packages, documents and approval steps adapted to each business.",
    "Owners gain a clear view of sales and collections, and staff spend less time searching for information across chats and files.",
  ],
  screenshots: pendingScreenshots([
    "Dashboard",
    "Customers",
    "Leads",
    "Packages",
    "Bookings",
    "Visa Processing",
    "Payments",
    "Reports",
  ]),
  featured: true,
  status: "published",
  seo: {
    title: "Travel Agency Management System Concept",
    description:
      "A concept travel agency management system covering leads, customers, packages, bookings, visa processing, payments and reports in one place.",
  },
};

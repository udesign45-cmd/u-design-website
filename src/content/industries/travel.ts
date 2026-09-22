import type { Industry } from "@/types/content";

export const travel: Industry = {
  slug: "travel",
  name: "Travel & Tourism",
  shortWorkflows: ["Customers", "Packages", "Bookings", "Visa Processing", "Payments"],
  summary:
    "Manage enquiries, packages, bookings, visa processing and payments for every traveller.",
  icon: "plane",
  priority: 6,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Travel Agencies and Tour Operators",
    intro:
      "Handle enquiries, packages, bookings, visa applications and payments in one system, so every traveller's file is complete and every deadline is visible.",
  },
  challenges: [
    {
      title: "Enquiries lost in messaging apps",
      description:
        "Most enquiries arrive on WhatsApp and social media, and quotations are sent without a record.",
    },
    {
      title: "Visa files tracked on paper",
      description:
        "Documents, submission dates and application status are hard to follow for each traveller.",
    },
    {
      title: "Package pricing in scattered files",
      description:
        "Package components and prices change often and are kept in separate spreadsheets.",
    },
    {
      title: "Partial payments and balances",
      description: "Advances, balances and refunds for each booking are difficult to reconcile.",
    },
  ],
  workflows: [
    {
      name: "Customers and leads",
      description: "Record every enquiry and traveller with their history.",
    },
    {
      name: "Packages",
      description: "Build packages from flights, hotels, transport and activities with pricing.",
    },
    {
      name: "Bookings",
      description: "Confirm bookings with travellers, dates, services and suppliers.",
    },
    {
      name: "Visa processing",
      description: "Track documents, submissions and application status per traveller.",
    },
    {
      name: "Payments",
      description: "Record advances, balances and refunds against each booking.",
    },
  ],
  solutions: ["custom-software", "crm", "website-development"],
  features: [
    {
      title: "Enquiry-to-booking pipeline",
      description: "Follow each enquiry through quotation, confirmation and travel.",
    },
    {
      title: "Visa document checklist",
      description: "Know which documents are received, pending or submitted for each application.",
    },
    {
      title: "Package builder",
      description: "Assemble and price packages consistently across the team.",
    },
    {
      title: "Booking ledger",
      description: "Payments received and balances due for every booking in one view.",
    },
  ],
  benefits: [
    {
      title: "More enquiries converted",
      description:
        "Quotations and follow-ups are tracked, so interested travellers are not forgotten.",
    },
    {
      title: "Fewer visa delays",
      description: "Missing documents and deadlines are visible before they cause problems.",
    },
    {
      title: "Clear financial position",
      description: "Know what has been collected and what is still due for each departure.",
    },
  ],
  projects: ["travel-agency-management"],
  seo: {
    title: "Travel Agency Management Software",
    description:
      "Travel agency software for enquiries, packages, bookings, visa processing and payments, so every traveller's file is complete and on time.",
  },
};

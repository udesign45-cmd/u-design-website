import type { Solution } from "@/types/content";

export const crm: Solution = {
  slug: "crm",
  name: "CRM Solutions",
  category: "software",
  summary: "Lead, customer, sales and follow-up management, so no enquiry is forgotten.",
  icon: "users",
  order: 3,
  status: "published",
  hasPage: true,
  hero: {
    heading: "CRM Solutions That Keep Every Lead and Customer on Track",
    intro:
      "Capture every enquiry, follow up on time and see your whole sales pipeline with a CRM shaped around the way your team sells.",
  },
  problem: {
    heading: "Where sales opportunities slip away",
    points: [
      {
        title: "Leads scattered across channels",
        description:
          "Enquiries arrive by phone, WhatsApp, email, social media and walk-in visits, and not all of them are recorded.",
      },
      {
        title: "Missed follow-ups",
        description:
          "Reminders depend on memory or personal notes, so interested customers go cold.",
      },
      {
        title: "No view of the pipeline",
        description:
          "Managers cannot see which deals are progressing, which are stuck and why others were lost.",
      },
      {
        title: "Customer history on personal phones",
        description:
          "When a salesperson is away or leaves, the conversation history and commitments go with them.",
      },
    ],
  },
  approach: {
    heading: "How a CRM helps",
    body: [
      "A CRM gives every lead and customer a single record: where they came from, what was discussed, what was offered and what happens next. Follow-ups are scheduled and visible, and managers can review the pipeline at any time.",
      "We configure stages, fields and reports to match your sales process, whether you sell properties, travel packages or products to distributors, instead of reshaping your process to fit a generic tool.",
    ],
  },
  features: [
    {
      title: "Lead capture",
      description:
        "Record enquiries from every channel in one place, with the source of each lead.",
    },
    {
      title: "Pipeline stages",
      description:
        "Move opportunities through stages that reflect how your business actually sells.",
    },
    {
      title: "Follow-up tasks and reminders",
      description: "Schedule calls, visits and messages so every lead receives a timely response.",
    },
    {
      title: "Complete customer history",
      description: "Notes, quotations, bookings and payments stay attached to the customer record.",
    },
    {
      title: "Sales reports",
      description: "See conversion by source, stage and salesperson to understand what is working.",
    },
    {
      title: "Team management",
      description: "Assign leads, set permissions and review activity across the sales team.",
    },
  ],
  benefits: [
    {
      title: "Fewer lost enquiries",
      description:
        "Every lead is recorded and assigned, so opportunities are not lost between channels.",
    },
    {
      title: "Consistent follow-up",
      description: "Scheduled tasks make timely follow-up the default rather than the exception.",
    },
    {
      title: "Clear sales visibility",
      description:
        "Managers can see the pipeline and forecast with real information instead of estimates.",
    },
  ],
  useCases: [
    "Real estate sales and site visits",
    "Travel agency enquiries and bookings",
    "Distributor and dealer accounts",
    "Service business customer management",
  ],
  industries: ["real-estate", "travel", "distribution", "retail", "healthcare"],
  projects: ["real-estate-crm", "travel-agency-management"],
  faqs: [
    {
      question: "What is a CRM system?",
      answer:
        "A CRM (customer relationship management) system captures leads, tracks follow-ups and records every interaction with a customer or prospect, so no enquiry is forgotten and management can see the whole sales pipeline.",
    },
    {
      question: "Why build a custom CRM instead of using an off-the-shelf one?",
      answer:
        "Off-the-shelf CRMs are built around a generic sales process. A custom CRM is configured around the way your team actually sells — your pipeline stages, follow-up rules and the information your industry needs to track.",
    },
    {
      question: "Which industries do you build CRM systems for?",
      answer:
        "We build CRM systems for real estate, travel, distribution, retail and healthcare businesses, each configured for how leads and customers move through that industry.",
    },
    {
      question: "Can a CRM connect to our other business systems?",
      answer:
        "Yes. Where it helps, we connect the CRM to the ERP, dashboards and marketing systems we build, so sales, operations and marketing work from the same data instead of separate tools.",
    },
  ],
  seo: {
    title: "CRM Development: Custom CRM for Sales Teams",
    description:
      "Custom CRM development to capture leads, schedule follow-ups and track your sales pipeline, configured around the way your team actually sells.",
  },
};

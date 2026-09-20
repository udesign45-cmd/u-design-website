import type { Solution } from "@/types/content";

export const automation: Solution = {
  slug: "automation",
  name: "Workflow Automation",
  category: "software",
  summary: "Reduce repetitive manual work and streamline everyday business processes.",
  icon: "workflow",
  order: 5,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Workflow Automation That Removes Repetitive Work",
    intro:
      "Automate approvals, notifications, data transfers and routine tasks so your team can focus on work that needs their judgement.",
  },
  problem: {
    heading: "Manual steps that cost time every day",
    points: [
      {
        title: "Copying data between tools",
        description:
          "The same information is typed into spreadsheets, accounting software and messages.",
      },
      {
        title: "Approvals stuck in inboxes",
        description:
          "Requests wait for a signature or a reply, and nobody can see where they are held up.",
      },
      {
        title: "Reminders that depend on people",
        description:
          "Deadlines, renewals and follow-ups are missed when the person who tracks them is busy.",
      },
      {
        title: "Paper and spreadsheet processes",
        description:
          "Forms are filled in by hand and re-entered later, which adds delay and errors.",
      },
    ],
  },
  approach: {
    heading: "How automation helps",
    body: [
      "We map a process step by step, identify which steps follow clear rules and automate those: routing requests for approval, sending notifications, moving data between systems and generating documents.",
      "People stay in control of the decisions that need judgement, while the routine work happens reliably in the background. Every step is recorded, so you can see what happened and when.",
    ],
  },
  features: [
    {
      title: "Approval workflows",
      description:
        "Route requests to the right person, with reminders and a clear status at every step.",
    },
    {
      title: "Automatic notifications",
      description:
        "Inform customers, suppliers and staff when something changes, without manual messages.",
    },
    {
      title: "Data transfer between systems",
      description: "Keep information consistent across the tools you use without re-typing it.",
    },
    {
      title: "Document generation",
      description:
        "Create quotations, invoices and reports from data that already exists in your system.",
    },
    {
      title: "Scheduled tasks",
      description:
        "Run recurring jobs such as reports, reminders and data checks on a set schedule.",
    },
    {
      title: "Activity history",
      description: "A record of each automated step for accountability and review.",
    },
  ],
  benefits: [
    {
      title: "Time back for your team",
      description: "Hours spent on routine data handling can move to customers and operations.",
    },
    {
      title: "Fewer delays",
      description:
        "Requests and hand-offs move forward without waiting for someone to notice them.",
    },
    {
      title: "Consistent processes",
      description:
        "The same rules apply every time, which reduces errors and improves accountability.",
    },
  ],
  useCases: [
    "Purchase and expense approvals",
    "Quotation and invoice generation",
    "Order status notifications",
    "Recurring management reports",
  ],
  industries: ["manufacturing", "logistics", "distribution", "construction", "healthcare"],
  projects: [],
  seo: {
    title: "Business Process Automation and Workflow Tools",
    description:
      "Business process automation that removes repetitive manual steps, from approvals and notifications to data transfer and reporting.",
  },
};

import type { IconName } from "@/types/content";

/**
 * About page copy (spec FR-070). No founding dates, headcounts, client counts
 * or awards (constitution II).
 * CONTENT INPUT REQUIRED (Q-7): `foundingStory` and `team` render only when supplied.
 * DRAFT: review (T222)
 */
export const about: {
  status: "published" | "published";
  hero: { heading: string; intro: string };
  who: { heading: string; body: string[] };
  approach: {
    heading: string;
    intro: string;
    points: { title: string; description: string; icon: IconName }[];
  };
  expertise: {
    heading: string;
    description: string;
    items: string[];
    href: string;
    icon: IconName;
  }[];
  philosophy: { heading: string; body: string[] };
  foundingStory?: string[];
  team?: { name: string; role: string }[];
} = {
  status: "published",
  hero: {
    heading: "A digital partner for growing businesses",
    intro:
      "U Design helps businesses digitalize their operations and grow. We build custom software, dashboards and automation, and we run the digital marketing that brings in new business.",
  },
  who: {
    heading: "Who we are",
    body: [
      "U Design is a digital solutions and digital marketing company. We work with business owners, directors and operations teams who want clearer processes, better visibility and a stronger presence in their market.",
      "Our work covers two connected capabilities: business software that organises how a company runs, and marketing that helps it reach and convert the right customers.",
    ],
  },
  approach: {
    heading: "Our approach",
    intro: "We start with the business, not the technology.",
    points: [
      {
        title: "Understand the workflow first",
        description:
          "We learn how work actually moves through your business, who is involved and where time is lost, before proposing any system.",
        icon: "search",
      },
      {
        title: "Design around your processes",
        description:
          "Software is shaped to your products, documents, approvals and reports instead of forcing your team into a generic template.",
        icon: "puzzle",
      },
      {
        title: "Deliver in practical steps",
        description:
          "We launch in stages so your operation keeps running while your team adopts each part of the new system.",
        icon: "list-checks",
      },
      {
        title: "Keep improving",
        description:
          "After launch, we refine and extend the solution as your business and priorities change.",
        icon: "refresh-cw",
      },
    ],
  },
  expertise: [
    {
      heading: "Software expertise",
      description:
        "Business systems that centralize operations and give management real-time visibility.",
      items: [
        "Custom business software",
        "ERP systems",
        "CRM solutions",
        "Business dashboards",
        "Workflow automation",
        "Business process digitalization",
      ],
      href: "/solutions",
      icon: "code",
    },
    {
      heading: "Digital marketing expertise",
      description:
        "Marketing that builds visibility and turns attention into enquiries your team can follow up.",
      items: [
        "Social media marketing and management",
        "Content creation",
        "Meta Ads",
        "Lead generation",
        "Performance marketing",
        "Digital strategy",
      ],
      href: "/digital-marketing",
      icon: "megaphone",
    },
  ],
  philosophy: {
    heading: "Build. Market. Grow.",
    body: [
      "We believe growing businesses need both strong systems and a steady flow of customers. Software without customers stalls, and marketing without organised operations creates problems the business cannot handle.",
      "That is why we bring both under one roof: we help you build the systems that run your business, market it to the right audience and grow with confidence.",
    ],
  },
  foundingStory: undefined,
  team: undefined,
};

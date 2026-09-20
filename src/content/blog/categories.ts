import type { BlogCategory } from "@/types/content";

/** Blog topics (spec FR-091). A category page exists only when it has published posts. */
export const blogCategories: BlogCategory[] = [
  {
    slug: "business-software",
    name: "Business Software",
    description:
      "Practical guidance on choosing and adopting software that fits how your business works.",
    seo: {
      title: "Business Software Articles and Guides",
      description:
        "Practical articles on choosing, planning and adopting business software that fits the way your company actually works.",
    },
  },
  {
    slug: "erp",
    name: "ERP",
    description: "How ERP systems connect operations, inventory, purchasing, sales and reporting.",
    seo: {
      title: "ERP Articles: Planning and Adopting an ERP",
      description:
        "Articles on ERP systems: when you need one, how to plan it and how to connect operations, inventory, purchasing and reporting.",
    },
  },
  {
    slug: "crm",
    name: "CRM",
    description: "Managing leads, customers, pipelines and follow-ups.",
    seo: {
      title: "CRM Articles: Leads, Pipelines and Follow-up",
      description:
        "Articles on CRM systems for sales teams: capturing leads, managing pipelines and making consistent follow-up the default.",
    },
  },
  {
    slug: "manufacturing-technology",
    name: "Manufacturing Technology",
    description: "Digital tools for production, materials, warehouses and factory reporting.",
    seo: {
      title: "Manufacturing Technology Articles and Guides",
      description:
        "Articles on manufacturing technology: production planning, raw materials, inventory, warehouse and factory reporting systems.",
    },
  },
  {
    slug: "dashboards",
    name: "Business Dashboards",
    description: "Turning business data into clear, real-time visibility for managers.",
    seo: {
      title: "Business Dashboard Articles and Reporting Guides",
      description:
        "Articles on business dashboards and reporting: deciding what to measure and giving managers clear, real-time visibility.",
    },
  },
  {
    slug: "automation",
    name: "Automation",
    description: "Reducing repetitive manual work with workflow automation.",
    seo: {
      title: "Workflow Automation Articles and Guides",
      description:
        "Articles on workflow and business process automation: approvals, notifications, data transfer and removing repetitive work.",
    },
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    description: "Moving from manual processes and spreadsheets to connected digital systems.",
    seo: {
      title: "Digital Transformation Articles for Businesses",
      description:
        "Articles on digital transformation for growing businesses: moving from spreadsheets and manual processes to connected systems.",
    },
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    description: "Building visibility and generating enquiries for B2B businesses.",
    seo: {
      title: "Digital Marketing Articles for B2B Businesses",
      description:
        "Articles on digital marketing for B2B businesses: building visibility, planning campaigns and turning attention into enquiries.",
    },
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    description: "Planning and improving Facebook and Instagram advertising.",
    seo: {
      title: "Meta Ads Articles: Facebook and Instagram Ads",
      description:
        "Articles on Meta Ads for businesses: planning Facebook and Instagram campaigns, targeting, creative and measuring results.",
    },
  },
  {
    slug: "social-media",
    name: "Social Media",
    description: "Running a consistent, professional social media presence.",
    seo: {
      title: "Social Media Articles for Business Brands",
      description:
        "Articles on social media for businesses: planning content, choosing platforms and keeping a consistent professional presence.",
    },
  },
  {
    slug: "lead-generation",
    name: "Lead Generation",
    description: "Turning marketing activity into enquiries your sales team can follow up.",
    seo: {
      title: "Lead Generation Articles and Practical Guides",
      description:
        "Articles on lead generation: landing pages, campaigns, tracking and connecting marketing enquiries to your sales process.",
    },
  },
];

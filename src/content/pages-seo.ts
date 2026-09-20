import type { Seo } from "@/types/content";

/**
 * SEO for static and hub pages (spec FR-100). One source for page metadata,
 * the sitemap and the uniqueness tests. Titles 30–60 chars, descriptions 70–160.
 */
export const pageSeo = {
  home: {
    title: "U Design | Custom Software, ERP & Digital Marketing",
    description:
      "U Design builds custom software, ERP, CRM, business dashboards and automation, and grows businesses through digital marketing and Meta Ads.",
  },
  solutions: {
    title: "Business Software Solutions: ERP, CRM and Dashboards",
    description:
      "Custom business software, ERP systems, CRM solutions, business dashboards and workflow automation, built around the way your business actually works.",
  },
  industries: {
    title: "Industries We Serve: Manufacturing, Distribution and More",
    description:
      "Business software and digital solutions for manufacturing, distribution, real estate, construction, logistics, travel, healthcare and retail companies.",
  },
  digitalMarketing: {
    title: "Digital Marketing Services for Growing Businesses",
    description:
      "Digital marketing services: social media marketing and management, content creation, Meta Ads, lead generation, performance marketing and digital strategy.",
  },
  portfolio: {
    title: "Portfolio: Business Software and ERP Projects",
    description:
      "Business software projects and concept systems from U Design, including manufacturing ERP, travel agency management and real estate CRM.",
  },
  about: {
    title: "About U Design: Software and Digital Marketing",
    description:
      "U Design is a digital solutions and digital marketing company that helps businesses digitalize operations, gain visibility and grow. Build. Market. Grow.",
  },
  contact: {
    title: "Contact U Design: Get a Free Consultation",
    description:
      "Request a free consultation with U Design about custom software, ERP, CRM, dashboards, automation or digital marketing for your business.",
  },
  blog: {
    title: "Blog: Business Software and Digital Growth",
    description:
      "Practical articles on business software, ERP, CRM, dashboards, automation, digital transformation and digital marketing for growing businesses.",
  },
} satisfies Record<string, Seo>;

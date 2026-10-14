import type { MarketingService } from "@/types/content";

export const seo: MarketingService = {
  slug: "seo",
  name: "SEO",
  category: "marketing",
  summary: "Search engine optimization that builds lasting visibility in unpaid search results.",
  icon: "search",
  order: 7,
  status: "published",
  covers: [
    {
      name: "SEO",
      benefit: "Technical, content and on-page work that builds visibility in search over time.",
    },
  ],
  hasPage: true,
  hero: {
    heading: "SEO That Builds Lasting Search Visibility",
    intro:
      "Technical fixes, on-page structure and content built around what your customers actually search for, so your business is found without paying for every visit.",
  },
  problem: {
    heading: "Why businesses stay invisible in search",
    points: [
      {
        title: "Technical issues block indexing",
        description: "Slow pages, broken links and missing structure keep search engines from ranking the site well.",
      },
      {
        title: "Content does not match real searches",
        description: "Pages are written for the business, not for the questions customers actually type.",
      },
      {
        title: "No consistent, ongoing work",
        description: "A one-time audit is not followed up, so rankings stall or slide back.",
      },
    ],
  },
  approach: {
    heading: "How we approach SEO",
    body: [
      "We start with a technical and content audit: what is blocking search engines, which pages should rank for which searches, and where the gaps are against what your customers actually look for.",
      "From there we fix the technical issues, structure pages around real search intent and build content that answers customer questions, then track rankings and traffic so the work keeps moving in the right direction.",
    ],
  },
  features: [
    {
      title: "Technical SEO audit",
      description: "Site speed, structure and indexing issues identified and fixed.",
    },
    {
      title: "Keyword and search intent research",
      description: "Target the searches your customers actually use.",
    },
    {
      title: "On-page optimization",
      description: "Titles, headings and page structure built around target searches.",
    },
    {
      title: "Content built for search",
      description: "Pages and articles that answer the questions customers are asking.",
    },
    {
      title: "Rank and traffic tracking",
      description: "Clear reporting on rankings, organic traffic and progress over time.",
    },
  ],
  outcomes: [
    {
      title: "Build visibility that lasts",
      description: "Rankings built on real search intent are not lost when ad spend stops.",
    },
    {
      title: "Reach customers researching before they buy",
      description: "Content answers the questions people ask before they contact a business.",
    },
    {
      title: "Track real progress",
      description: "Rankings and organic traffic reported clearly over time.",
    },
  ],
  benefits: [
    {
      title: "Lower cost per visitor over time",
      description: "Unlike paid campaigns, organic visibility continues without ongoing spend per click.",
    },
    {
      title: "Credibility with customers",
      description: "Businesses that rank well are seen as more established and trustworthy.",
    },
    {
      title: "Compounding results",
      description: "Technical and content work builds on itself month over month.",
    },
  ],
  useCases: [
    "Technical SEO audits and fixes",
    "Local SEO for branch or service-area businesses",
    "Content built around customer search questions",
    "Ongoing ranking and traffic tracking",
  ],
  industries: ["manufacturing", "real-estate", "healthcare", "retail"],
  projects: [],
  faqs: [
    {
      question: "How long does SEO take to show results?",
      answer:
        "SEO builds visibility over months rather than days. Technical fixes can help quickly, but ranking improvements for competitive searches typically take a few months of consistent work to show.",
    },
    {
      question: "What is the difference between SEO and Google Ads?",
      answer:
        "SEO builds visibility in the unpaid search results over time, while Google Ads places your business at the top immediately through paid campaigns. Many businesses use both together.",
    },
    {
      question: "Do you write the content as well as the technical work?",
      answer:
        "Yes. We handle the technical audit and fixes, keyword and search intent research, on-page structure, and the content itself, so the work is not split across separate providers.",
    },
    {
      question: "How do you decide which keywords to target?",
      answer:
        "We research the actual searches your customers use, prioritizing terms with genuine buying intent over broad terms that bring traffic but not enquiries.",
    },
  ],
  seo: {
    title: "SEO Services: Technical, On-Page and Content SEO",
    description:
      "SEO services covering technical audits, keyword research, on-page optimization and content built around real customer search intent.",
  },
};

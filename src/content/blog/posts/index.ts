import type { ComponentType } from "react";
import featuredSpreadsheets from "@/assets/blog/signs-your-business-has-outgrown-spreadsheets.png";
import type { BlogPostMeta } from "@/types/content";
import OutgrownSpreadsheets from "./signs-your-business-has-outgrown-spreadsheets.mdx";

export type BlogPost = BlogPostMeta & { Content: ComponentType };

/**
 * Post registry (plan AD-08). Add new posts here: import the MDX file and its
 * typed metadata. The slug must equal the MDX filename.
 */
export const posts: BlogPost[] = [
  {
    slug: "signs-your-business-has-outgrown-spreadsheets",
    title: "7 Signs Your Business Has Outgrown Spreadsheets",
    excerpt:
      "Spreadsheets help businesses start, but they become risky as teams grow. Here are the warning signs, what changes with a centralized system and how to plan the move.",
    featuredImage: {
      src: featuredSpreadsheets,
      alt: "A spreadsheet file on the left and an operations dashboard on the right, connected by an arrow",
    },
    author: undefined,
    publishedAt: "2026-09-19",
    updatedAt: undefined,
    category: "digital-transformation",
    tags: ["spreadsheets", "business software", "ERP", "process improvement"],
    relatedSolutions: ["custom-software", "erp", "business-dashboards", "automation"],
    relatedIndustries: ["manufacturing", "distribution"],
    seo: {
      title: "7 Signs Your Business Has Outgrown Spreadsheets",
      description:
        "Warning signs that your business has outgrown Excel, what changes with a centralized system and how to plan the move without disrupting operations.",
    },
    status: "published",
    Content: OutgrownSpreadsheets,
  },
];

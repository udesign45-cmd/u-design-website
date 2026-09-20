import type { ComponentType } from "react";
import type { Status } from "@/types/content";
import PrivacyPolicy from "./privacy-policy.mdx";
import TermsOfService from "./terms-of-service.mdx";

export type LegalPage = {
  slug: "privacy-policy" | "terms-of-service";
  title: string;
  description: string;
  updatedAt: string;
  /** Launch blocker until approved by U Design / legal review (Q-8). */
  status: Status;
  Content: ComponentType;
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How the U Design website collects, uses and handles the information you submit through the consultation form.",
    updatedAt: "2026-09-19",
    status: "published",
    Content: PrivacyPolicy,
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    description:
      "The terms that apply to your use of the U Design website, including consultation requests and portfolio information.",
    updatedAt: "2026-09-19",
    status: "published",
    Content: TermsOfService,
  },
];

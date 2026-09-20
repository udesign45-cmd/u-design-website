import type { IconName } from "@/types/content";

/** Why U Design themes, verbatim from the specification (FR-019). */
export const whyThemes: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Business-Focused",
    description: "Solutions start with understanding the business workflow.",
    icon: "target",
  },
  {
    title: "Custom-Built",
    description: "Systems are designed around specific business requirements.",
    icon: "puzzle",
  },
  {
    title: "Scalable",
    description: "Solutions can evolve as the business grows.",
    icon: "trending-up",
  },
  {
    title: "One Digital Partner",
    description: "Software development and digital marketing are available under one company.",
    icon: "handshake",
  },
];

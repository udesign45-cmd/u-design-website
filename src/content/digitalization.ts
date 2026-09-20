import type { IconName } from "@/types/content";

/** "Still Managing Your Business With Spreadsheets?" section (spec FR-016). */
export const digitalization = {
  eyebrow: "Business digitalization",
  heading: "Still Managing Your Business With Spreadsheets?",
  intro:
    "Most growing businesses reach a point where spreadsheets, messages and paper can no longer keep up. If any of these sound familiar, there is a better way to run your operations.",
  painPoints: [
    "Excel spreadsheets that only one person understands",
    "Separate systems that do not talk to each other",
    "Manual reporting that takes days",
    "Orders and approvals handled over WhatsApp",
    "Paper-based forms and registers",
    "Disconnected data across departments",
    "Manual follow-ups that get forgotten",
    "Multiple tools with no central visibility",
  ],
  stages: [
    {
      title: "Manual Processes",
      description:
        "Spreadsheets, paper and messages, with information scattered across people and tools.",
      icon: "file-spreadsheet",
    },
    {
      title: "Centralized Business Software",
      description:
        "One system built around your workflow, where every department records its work.",
      icon: "database",
    },
    {
      title: "Real-Time Business Visibility",
      description:
        "Live dashboards that show what is happening across the business, as it happens.",
      icon: "layout-dashboard",
    },
  ] satisfies { title: string; description: string; icon: IconName }[],
  cta: { label: "Discuss Your Business Process" as const },
};

/** The six-step process, verbatim from the specification (FR-017). */
export const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the business, workflow, goals, and challenges.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Define the required solution and business process.",
  },
  { number: "03", title: "Design", description: "Create a clear and intuitive experience." },
  { number: "04", title: "Build", description: "Develop the custom solution." },
  { number: "05", title: "Launch", description: "Test, deploy, and help the team get started." },
  {
    number: "06",
    title: "Grow",
    description: "Improve and scale the solution as the business evolves.",
  },
] as const;

export type ProcessStepData = (typeof processSteps)[number];

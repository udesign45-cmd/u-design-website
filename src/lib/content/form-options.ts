import { budgetOptions } from "@/content/form-options";
import type { FormOptions } from "@/types/content";
import { getAllIndustries } from "./industries";
import { getAllMarketingServices } from "./marketing";
import { getAllSolutions } from "./solutions";

/**
 * Consultation form choices, derived from content so they never drift (T037).
 * Includes draft entries by design: the options describe services U Design offers.
 */
export function getFormOptions(): FormOptions {
  return {
    industries: [
      ...getAllIndustries().map((i) => ({ value: i.slug, label: i.name })),
      { value: "other", label: "Other" },
    ],
    needs: [
      ...getAllSolutions().map((s) => ({
        value: s.slug,
        label: s.name,
        group: "software" as const,
      })),
      ...getAllMarketingServices().map((m) => ({
        value: m.slug,
        label: m.name,
        group: "marketing" as const,
      })),
      { value: "not-sure", label: "Not sure yet", group: "other" as const },
    ],
    budgets: budgetOptions,
  };
}

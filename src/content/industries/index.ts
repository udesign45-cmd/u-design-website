import type { Industry } from "@/types/content";
import { construction } from "./construction";
import { distribution } from "./distribution";
import { healthcare } from "./healthcare";
import { logistics } from "./logistics";
import { manufacturing } from "./manufacturing";
import { realEstate } from "./real-estate";
import { restaurants } from "./restaurants";
import { retail } from "./retail";
import { textile } from "./textile";
import { travel } from "./travel";

/** All industries. Add new entries here; pages, navigation and form options follow. */
export const industries: Industry[] = [
  manufacturing,
  distribution,
  realEstate,
  construction,
  logistics,
  travel,
  healthcare,
  retail,
  textile,
  restaurants,
];

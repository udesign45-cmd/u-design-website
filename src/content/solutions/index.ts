import type { Solution } from "@/types/content";
import { automation } from "./automation";
import { businessDashboards } from "./business-dashboards";
import { crm } from "./crm";
import { customSoftware } from "./custom-software";
import { erp } from "./erp";

/** All software solutions. Add new entries here; pages and navigation follow automatically. */
export const solutions: Solution[] = [customSoftware, erp, crm, businessDashboards, automation];

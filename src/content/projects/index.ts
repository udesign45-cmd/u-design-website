import type { Project } from "@/types/content";
import { manufacturingErp } from "./manufacturing-erp";
import { realEstateCrm } from "./real-estate-crm";
import { travelAgencyManagement } from "./travel-agency-management";

/** Portfolio projects. Concept/demo work must keep `type: "concept"` (constitution II). */
export const projects: Project[] = [manufacturingErp, travelAgencyManagement, realEstateCrm];

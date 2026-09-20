import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types/content";

/** "Concept / Demo" vs "Client Project", always shown as text (FR-052). */
export function ProjectTypeBadge({ type }: { type: Project["type"] }) {
  return type === "client" ? (
    <Badge variant="client">Client Project</Badge>
  ) : (
    <Badge variant="concept">Concept / Demo</Badge>
  );
}

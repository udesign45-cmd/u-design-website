/** Builds consultation links with optional pre-selection (contracts/consultation-action.md). */
export function consultationHref({
  industry,
  need,
  source,
  plan,
}: { industry?: string; need?: string; source?: string; plan?: string } = {}): string {
  const params = new URLSearchParams();
  if (industry) params.set("industry", industry);
  if (need) params.set("need", need);
  if (source) params.set("source", source);
  if (plan) params.set("plan", plan);
  const query = params.toString();
  return `/contact${query ? `?${query}` : ""}#consultation`;
}

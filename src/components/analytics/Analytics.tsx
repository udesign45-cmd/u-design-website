import { AnalyticsScripts } from "./AnalyticsScripts";
import { TrackClicks } from "./TrackClicks";

/** Analytics islands. Imported by the layout only when an analytics ID is configured. */
export function Analytics({ gaId, metaPixelId }: { gaId?: string; metaPixelId?: string }) {
  return (
    <>
      <AnalyticsScripts gaId={gaId} metaPixelId={metaPixelId} />
      <TrackClicks />
    </>
  );
}

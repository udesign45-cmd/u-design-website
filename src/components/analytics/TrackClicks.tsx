"use client";

import { useEffect } from "react";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

/**
 * One delegated listener for server-rendered `data-track` attributes, plus
 * `data-track-view` page views. Mounted only when analytics is configured.
 */
export function TrackClicks() {
  useEffect(() => {
    const page = window.location.pathname;
    document.querySelectorAll<HTMLElement>("[data-track-view]").forEach((el) => {
      if (el.dataset.trackView === "portfolio_view") {
        track("portfolio_view", {
          project: el.dataset.trackProject ?? "",
          type: el.dataset.trackType ?? "",
        });
      }
    });

    const onClick = (event: MouseEvent) => {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const name = el.dataset.track as AnalyticsEventName;
      if (name === "cta_click") {
        track("cta_click", {
          label: el.dataset.trackLabel ?? el.textContent?.trim() ?? "",
          location: el.dataset.trackLocation ?? "",
          page,
        });
      } else if (name === "contact_click") {
        track("contact_click", { channel: el.dataset.trackChannel ?? "", page });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

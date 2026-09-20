import pendingImage from "@/assets/portfolio/pending-screenshot.png";
import type { Screenshot, StaticImage } from "@/types/content";

/**
 * Preview-only placeholder (task T121). A project that still uses it can never
 * have a page in production and fails the integrity suite if published.
 * CONTENT INPUT REQUIRED (Q-4): replace with real product UI screenshots.
 */
export const PENDING_SCREENSHOT: StaticImage = {
  src: pendingImage,
  alt: "Placeholder frame: product screenshot pending",
  isPlaceholder: true,
};

export function pendingScreenshots(modules: string[]): Screenshot[] {
  return modules.map((module) => ({
    image: PENDING_SCREENSHOT,
    caption: `${module} screen (screenshot pending, preview only)`,
    module,
  }));
}

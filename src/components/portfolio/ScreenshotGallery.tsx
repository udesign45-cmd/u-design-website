import Image from "next/image";
import type { Screenshot } from "@/types/content";

/**
 * Captioned product screenshots (spec FR-053). Mobile: a horizontally
 * scrolling strip inside its own keyboard-focusable region (no page overflow).
 * Desktop: two-column grid. Each image opens full size via a plain link.
 */
export function ScreenshotGallery({
  screenshots,
  title,
}: {
  screenshots: Screenshot[];
  title: string;
}) {
  if (screenshots.length === 0) return null;
  return (
    <div
      role="region"
      aria-label={`${title} screenshots`}
      tabIndex={0}
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
    >
      {screenshots.map((shot, index) => (
        <figure
          key={`${shot.caption}-${index}`}
          className="w-4/5 shrink-0 snap-start overflow-hidden rounded-card border border-line bg-white md:w-auto"
        >
          <a
            href={shot.image.src.src}
            className="block"
            aria-label={`Open full size: ${shot.caption}`}
          >
            <Image
              src={shot.image.src}
              alt={shot.image.alt}
              sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 80vw"
              className="h-auto w-full"
            />
          </a>
          <figcaption className="border-t border-line px-4 py-3 text-small text-ink-muted">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

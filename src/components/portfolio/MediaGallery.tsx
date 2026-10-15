"use client";

import Image, { type StaticImageData } from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
  PlayIcon,
} from "@/components/ui/InlineIcons";
import type { CreativeCategory, CreativeItem } from "@/types/content";
import { cx } from "@/lib/utils/cx";

type MediaGalleryProps = Pick<CreativeCategory, "name" | "aspect" | "items">;

const gridClass: Record<CreativeCategory["aspect"], string> = {
  "4/5": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  "16/9": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

const tileSizes: Record<CreativeCategory["aspect"], string> = {
  "4/5": "(min-width: 1280px) 290px, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw",
  "16/9": "(min-width: 1280px) 390px, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw",
};

const noopSubscribe = () => () => undefined;

/**
 * Sizes viewer media from its known dimensions (largest fit inside the viewer), so it
 * has a box before it loads: the blur preview shows at once and nothing jumps.
 */
function fitToViewer({ width, height }: StaticImageData): CSSProperties {
  return {
    aspectRatio: `${width} / ${height}`,
    width: `min(100%, calc((100dvh - 6.5rem) * ${(width / height).toFixed(4)}))`,
  };
}

function hrefFor(item: CreativeItem) {
  return item.kind === "image" ? item.image.src.src : item.src;
}

function labelFor(item: CreativeItem) {
  return item.kind === "image"
    ? `View full size: ${item.title}`
    : `Play video: ${item.title} (${item.duration})`;
}

/**
 * Creative work grid with a full-screen viewer. Tiles are plain links to the
 * full image or video file, so everything works before (or without) hydration;
 * once hydrated, a click opens the native modal <dialog> instead. Videos load
 * nothing until opened: the grid shows optimized poster frames only.
 */
export function MediaGallery({ name, aspect, items }: MediaGalleryProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? undefined : items[index];
  // True once hydrated: tiles then open the viewer instead of following their link.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [index]);

  // Never leave the page scroll-locked if the gallery unmounts with the viewer open.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const close = () => dialogRef.current?.close();
  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));

  const open = (event: MouseEvent<HTMLAnchorElement>, i: number) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return; // Let modified clicks open the file in a new tab as usual.
    }
    event.preventDefault();
    setIndex(i);
  };

  return (
    <>
      <ul
        className={cx("grid gap-3 sm:gap-4", gridClass[aspect])}
        data-ready={hydrated || undefined}
      >
        {items.map((item, i) => {
          const thumb = item.kind === "image" ? item.image : item.poster;
          return (
            <li key={hrefFor(item)}>
              <a
                href={hrefFor(item)}
                onClick={(event) => open(event, i)}
                aria-label={labelFor(item)}
                className={cx(
                  "group relative block overflow-hidden rounded-card bg-ink shadow-card",
                  "transition-[transform,box-shadow] duration-250 ease-standard hover:-translate-y-0.5 hover:shadow-raised",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark",
                  aspect === "4/5" ? "aspect-4/5" : "aspect-video",
                )}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt}
                  fill
                  sizes={tileSizes[aspect]}
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 ease-standard group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/55 to-transparent px-3 pt-10 pb-3 text-small font-medium text-white sm:px-4"
                >
                  {item.title}
                </span>
                {item.kind === "video" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-brand-green text-ink shadow-raised transition-transform duration-250 ease-standard group-hover:scale-110 sm:size-14"
                    >
                      <PlayIcon size={22} className="ml-0.5 fill-current" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute top-2.5 right-2.5 rounded-pill bg-ink/75 px-2 py-0.5 text-micro font-medium text-white tabular-nums"
                    >
                      {item.duration}
                    </span>
                  </>
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-pill bg-ink/70 text-white opacity-0 transition-opacity duration-250 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ExpandIcon size={16} />
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        onClose={() => {
          setIndex(null);
          document.documentElement.style.overflow = "";
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          // A focused video uses the arrow keys to seek.
          if (event.target instanceof HTMLVideoElement) return;
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onTouchStart={(event) => {
          touchX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchX.current;
          const end = event.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 50) return;
          step(end < start ? 1 : -1);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ink/95 p-0 text-white backdrop:bg-ink/60"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <p id={`${id}-title`} className="min-w-0 flex-1 truncate font-semibold">
                <span className="sr-only">{name}: </span>
                {current.title}
              </p>
              <span className="text-small text-white/75 tabular-nums">
                {(index ?? 0) + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex size-11 items-center justify-center rounded-pill bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-brand-green"
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20"
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              {current.kind === "image" ? (
                <Image
                  key={current.image.src.src}
                  src={current.image.src}
                  alt={current.image.alt}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  loading="eager"
                  placeholder="blur"
                  style={fitToViewer(current.image.src)}
                  className="h-auto rounded-control"
                />
              ) : (
                <video
                  key={current.src}
                  src={current.src}
                  poster={current.poster.src.src}
                  controls
                  autoPlay
                  playsInline
                  style={fitToViewer(current.poster.src)}
                  className="h-auto rounded-control bg-ink"
                />
              )}
              {items.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous"
                    className="absolute top-1/2 left-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-pill bg-ink/60 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-brand-green sm:left-2 sm:size-12 sm:bg-white/10"
                  >
                    <ChevronLeftIcon size={26} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next"
                    className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center rounded-pill bg-ink/60 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-brand-green sm:right-2 sm:size-12 sm:bg-white/10"
                  >
                    <ChevronRightIcon size={26} />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

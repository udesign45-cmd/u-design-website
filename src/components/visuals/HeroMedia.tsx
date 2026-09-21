"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroMediaProps = {
  poster: StaticImageData;
  posterAlt: string;
  videoSrc: string;
  className?: string;
};

/**
 * Hero background: a poster image paints immediately (it is not the LCP
 * element — the H1 is — but it must still be cheap), and the video is
 * attached only after the page has settled, on viewports wide enough to
 * make it worth the bytes. This keeps the video off the critical path
 * entirely: no `autoplay` attribute at parse time, no preloading.
 *
 * Respects `prefers-reduced-motion` and Data Saver by simply never
 * attaching a source, in which case the poster is the final result.
 */
export function HeroMedia({ poster, posterAlt, videoSrc, className }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    const narrow = window.matchMedia("(max-width: 63.9375rem)").matches; // < lg
    if (reducedMotion || saveData || narrow) return;

    const video = videoRef.current;
    if (!video) return;

    const attach = () => {
      video.src = videoSrc;
      video.load();
      video.play().then(
        () => setPlaying(true),
        () => undefined, // Autoplay can be refused by the browser; the poster stands in.
      );
    };
    // Idle, not on-load: the hero must never compete with the H1/CTA paint.
    const ric = ("requestIdleCallback" in window ? window.requestIdleCallback : undefined) as
      | ((cb: () => void) => number)
      | undefined;
    const handle = ric ? ric(attach) : window.setTimeout(attach, 300);
    return () => {
      if (ric && "cancelIdleCallback" in window) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [videoSrc]);

  return (
    <div aria-hidden="true" className={`media-kenburns overflow-hidden ${className ?? ""}`}>
      <Image
        src={poster}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-1000 ${playing ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { site } from "@/content/site";
import { cx } from "@/lib/utils/cx";

/**
 * Brand mark. Uses the official logo when provided; otherwise a typographic
 * wordmark built from tokens. Replace with the official logo (Q-2, launch blocker).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cx("inline-flex items-center", className)}>
      {site.logo ? (
        <Image
          src={site.logo.src}
          alt="U Design home"
          height={32}
          className="h-8 w-auto"
          priority
        />
      ) : (
        <span className="inline-flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-fg">
          <span className="inline-flex size-8 items-center justify-center rounded-control bg-brand-green text-base text-ink">
            U
          </span>{" "}
          {/* Below 375px the mark alone keeps the header from overflowing (T200). */}
          <span className="hidden xs:inline">DESIGN</span>
          <span className="sr-only">, home</span>
        </span>
      )}
    </Link>
  );
}

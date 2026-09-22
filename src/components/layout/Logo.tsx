import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { site } from "@/content/site";
import { cx } from "@/lib/utils/cx";

type LogoProps = {
  className?: string;
  /** "dark" for light surfaces (default), "light" for dark surfaces (the footer). */
  variant?: "dark" | "light";
};

/** Brand mark. Uses the official logo, choosing the variant that reads on the surface behind it. */
export function Logo({ className, variant = "dark" }: LogoProps) {
  const mark = variant === "light" ? (site.logoLight ?? site.logo) : site.logo;
  return (
    <Link href="/" className={cx("inline-flex items-center", className)}>
      {mark ? (
        <Image src={mark.src} alt="U Design home" height={44} className="h-11 w-auto" priority />
      ) : (
        <span className="inline-flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-fg">
          <span className="inline-flex size-11 items-center justify-center rounded-control bg-brand-green text-lg text-ink">
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

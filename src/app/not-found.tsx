import type { Metadata } from "next";
import Link from "@/components/ui/AppLink";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Branded 404 with helpful routes and the consultation CTA (spec FR-007). */
export default function NotFound() {
  return (
    <Section surface="gray">
      <div className="max-w-2xl">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-h1">Page not found</h1>
        <p className="mt-4 text-lead text-fg-muted">
          The page you are looking for may have moved or no longer exists. These pages are a good
          place to continue.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          <li>
            <Link href="/" className="font-medium link-inline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/solutions" className="font-medium link-inline">
              Solutions
            </Link>
          </li>
          <li>
            <Link href="/industries" className="font-medium link-inline">
              Industries
            </Link>
          </li>
        </ul>
        <div className="mt-10">
          <ButtonLink
            href="/contact#consultation"
            size="lg"
            track={{ event: "cta_click", label: "Get Free Consultation", location: "not-found" }}
          >
            Get Free Consultation
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

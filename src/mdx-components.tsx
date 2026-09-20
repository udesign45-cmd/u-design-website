import type { MDXComponents } from "mdx/types";
import Link from "@/components/ui/AppLink";
import type { AnchorHTMLAttributes } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getSolution } from "@/lib/content";
import { consultationHref } from "@/lib/cta";

/**
 * Global MDX components (plan AD-08). Must live in src/ with the src/ layout.
 * Styling comes from `.prose-udesign` on the wrapping container.
 */

function MdxLink({ href = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...rest}>
      {children}
    </a>
  );
}

/** In-article consultation prompt. */
function InternalCta({ need, industry }: { need?: string; industry?: string }) {
  return (
    <aside className="my-10 rounded-panel surface-deep p-6 md:p-8">
      <p className="font-heading text-h4 font-semibold">Want to discuss your own process?</p>
      <p className="mt-2 text-fg-muted">
        Tell us how your business works today. We will suggest a practical way forward in a free
        consultation.
      </p>
      <div className="mt-5">
        <ButtonLink
          href={consultationHref({ need, industry })}
          track={{ event: "cta_click", label: "Get Free Consultation", location: "article" }}
        >
          Get Free Consultation
        </ButtonLink>
      </div>
    </aside>
  );
}

/** Contextual link to a solution page (internal linking, FR-090). */
function RelatedSolution({ slug }: { slug: string }) {
  const solution = getSolution(slug);
  if (!solution) return null;
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="my-6 flex items-center justify-between gap-4 rounded-card border border-line bg-surface-gray p-5 no-underline hover:border-ink"
    >
      <span>
        <span className="block text-small text-ink-muted">Related solution</span>
        <span className="font-heading text-h4 font-semibold text-ink">{solution.name}</span>
      </span>
      <Icon name="arrow-right" size={20} className="text-brand-green-dark" />
    </Link>
  );
}

const components: MDXComponents = {
  a: MdxLink,
  InternalCta,
  RelatedSolution,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

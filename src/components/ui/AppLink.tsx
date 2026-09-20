import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Site-wide link (plan AD-12, performance). Viewport prefetching is disabled by
 * default: marketing pages contain dozens of links, and prefetching every static
 * route on a mobile connection inflated JavaScript transfer and blocking time.
 * Navigation stays client-side; the static route loads on click from the CDN.
 * Pass `prefetch` explicitly for a link that should prefetch.
 */
export default function AppLink({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}

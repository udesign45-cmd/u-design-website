import { serializeJsonLd } from "@/lib/seo/jsonld";

/** Renders one JSON-LD block. Content is escaped to prevent script injection. */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

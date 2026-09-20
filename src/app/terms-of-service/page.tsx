import { LegalTemplate } from "@/components/templates/LegalTemplate";
import { legalPages } from "@/content/legal";
import { buildMetadata } from "@/lib/seo/metadata";

const page = legalPages.find((p) => p.slug === "terms-of-service");

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: page?.description ?? "",
  path: "/terms-of-service",
  noindex: page?.status !== "published",
});

export default function TermsOfServicePage() {
  return <LegalTemplate page={page} />;
}

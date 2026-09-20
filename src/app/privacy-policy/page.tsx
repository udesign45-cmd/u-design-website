import { LegalTemplate } from "@/components/templates/LegalTemplate";
import { legalPages } from "@/content/legal";
import { buildMetadata } from "@/lib/seo/metadata";

const page = legalPages.find((p) => p.slug === "privacy-policy");

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: page?.description ?? "",
  path: "/privacy-policy",
  noindex: page?.status !== "published",
});

export default function PrivacyPolicyPage() {
  return <LegalTemplate page={page} />;
}

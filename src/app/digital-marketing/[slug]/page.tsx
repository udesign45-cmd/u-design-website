import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingServiceTemplate } from "@/components/templates/MarketingServiceTemplate";
import { getMarketingPage, getMarketingPages } from "@/lib/content";
import { buildMetadata, entryOgImage } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMarketingPages().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getMarketingPage((await params).slug);
  if (!service) return {};
  const path = `/digital-marketing/${service.slug}`;
  return buildMetadata({
    ...service.seo,
    path,
    image: entryOgImage(path, "U Design Digital Marketing"),
  });
}

export default async function MarketingServicePage({ params }: Props) {
  const service = getMarketingPage((await params).slug);
  if (!service) notFound();
  return <MarketingServiceTemplate service={service} />;
}

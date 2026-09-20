import { getMarketingPage } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design Digital Marketing";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getMarketingPage((await params).slug);
  return renderOgImage({
    eyebrow: "U Design Digital Marketing",
    title: entry?.hero.heading ?? "Digital marketing",
  });
}

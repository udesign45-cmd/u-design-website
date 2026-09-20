import { getIndustryPage } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design Industries";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getIndustryPage((await params).slug);
  return renderOgImage({
    eyebrow: "U Design Industries",
    title: entry?.hero.heading ?? "Industries we serve",
  });
}

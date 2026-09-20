import { getSolutionPage } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design Solutions";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getSolutionPage((await params).slug);
  return renderOgImage({
    eyebrow: "U Design Solutions",
    title: entry?.hero.heading ?? "Business software solutions",
  });
}

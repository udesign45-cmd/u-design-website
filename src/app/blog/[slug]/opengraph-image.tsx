import { getPost } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design Insights";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getPost((await params).slug);
  return renderOgImage({ eyebrow: "U Design Insights", title: entry?.title ?? "U Design Blog" });
}

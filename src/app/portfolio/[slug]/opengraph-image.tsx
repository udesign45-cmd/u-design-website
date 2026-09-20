import { getProjectPages } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design Portfolio";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectPages().find((p) => p.slug === slug);
  return renderOgImage({
    eyebrow: project?.type === "client" ? "Client Project" : "Concept / Demo",
    title: project?.title ?? "U Design Portfolio",
  });
}

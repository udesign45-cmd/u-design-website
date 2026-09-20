import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = "U Design: Digital Solutions That Help Businesses Grow";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Build. Market. Grow.",
    title: "Digital Solutions That Help Businesses Grow",
  });
}

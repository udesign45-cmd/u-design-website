import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "@/components/templates/ArticleTemplate";
import { getPost, getPublishedPosts, getRelatedPosts } from "@/lib/content";
import { buildMetadata, entryOgImage } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const metadata = buildMetadata({
    ...post.seo,
    path: `/blog/${post.slug}`,
    image: entryOgImage(`/blog/${post.slug}`, "U Design Insights"),
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: post.author ? [post.author.name] : undefined,
  });
  if (post.canonical) metadata.alternates = { canonical: post.canonical };
  return metadata;
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return <ArticleTemplate post={post} related={getRelatedPosts(post)} />;
}

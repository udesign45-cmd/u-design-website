import { blogCategories } from "@/content/blog/categories";
import { posts, type BlogPost } from "@/content/blog/posts";
import type { BlogCategory } from "@/types/content";
import { isVisible } from "./core";

const newestFirst = (a: BlogPost, b: BlogPost) => b.publishedAt.localeCompare(a.publishedAt);

/** Visible posts, newest first (plan AD-08). The same signatures can be backed by a CMS later. */
export function getPublishedPosts({
  category,
  source = posts,
}: { category?: string; source?: BlogPost[] } = {}): BlogPost[] {
  return source
    .filter(isVisible)
    .filter((p) => !category || p.category === category)
    .sort(newestFirst);
}

export function getPost(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

/** Shared category or tags first, then the newest posts. */
export function getRelatedPosts(post: BlogPost, n = 3, source: BlogPost[] = posts): BlogPost[] {
  const others = getPublishedPosts({ source }).filter((p) => p.slug !== post.slug);
  const score = (p: BlogPost) =>
    (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return [...others].sort((a, b) => score(b) - score(a) || newestFirst(a, b)).slice(0, n);
}

export function getBlogCategory(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getCategoriesWithPosts(source: BlogPost[] = posts): BlogCategory[] {
  const used = new Set(getPublishedPosts({ source }).map((p) => p.category));
  return blogCategories.filter((c) => used.has(c.slug));
}

/** The blog is linked and indexed only once a post is visible (FR-092). */
export function hasBlog(source: BlogPost[] = posts): boolean {
  return getPublishedPosts({ source }).length > 0;
}

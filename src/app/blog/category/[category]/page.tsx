import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/shared/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogCategory, getCategoriesWithPosts, getPublishedPosts } from "@/lib/content";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { cx } from "@/lib/utils/cx";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoriesWithPosts().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getBlogCategory((await params).category);
  if (!category) return {};
  return buildMetadata({ ...category.seo, path: `/blog/category/${category.slug}` });
}

/** Indexable topic page (FR-090), generated only for categories with posts. */
export default async function BlogCategoryPage({ params }: Props) {
  const category = getBlogCategory((await params).category);
  const posts = category ? getPublishedPosts({ category: category.slug }) : [];
  if (!category || posts.length === 0) notFound();
  const trail = buildTrail([
    { name: "Blog", path: "/blog" },
    { name: category.name, path: `/blog/category/${category.slug}` },
  ]);
  return (
    <>
      <PageHero
        breadcrumbs={trail}
        eyebrow="Blog"
        title={category.name}
        intro={category.description}
        surface="gray"
      />
      <Section surface="white" id="articles" labelledBy="articles-heading">
        <h2 id="articles-heading" className="sr-only">
          Articles
        </h2>
        <ul
          className={cx(
            "grid gap-6",
            posts.length === 1 && "max-w-md",
            posts.length >= 2 && "md:grid-cols-2",
            posts.length >= 3 && "lg:grid-cols-3",
          )}
        >
          {posts.map((post) => (
            <li key={post.slug}>
              <ArticleCard post={post} categoryName={category.name} headingLevel={3} />
            </li>
          ))}
        </ul>
      </Section>
      <JsonLd data={breadcrumbList(trail)} />
    </>
  );
}

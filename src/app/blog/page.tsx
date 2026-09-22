import Link from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/sections/shared/PageHero";
import { getBlogCategory, getCategoriesWithPosts, getPublishedPosts, hasBlog } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { cx } from "@/lib/utils/cx";

export const metadata = buildMetadata({ ...pageSeo.blog, path: "/blog" });

/** Blog index; returns 404 until at least one post is visible (FR-092). */
export default function BlogPage() {
  if (!hasBlog()) notFound();
  const posts = getPublishedPosts();
  const categories = getCategoriesWithPosts();
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Blog", path: "/blog" }])}
        eyebrow="Insights"
        title="Practical insights for growing businesses"
        intro="Guides on business software, digitalization and digital marketing, written for owners and managers."
        surface="gray"
      />
      <Section surface="white" id="articles" labelledBy="articles-heading">
        <h2 id="articles-heading" className="sr-only">
          Articles
        </h2>
        {categories.length > 1 ? (
          <nav aria-label="Blog categories" className="mb-10">
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/blog/category/${c.slug}`}
                    className="inline-flex min-h-11 items-center rounded-pill border border-line px-4 text-small font-medium hover:border-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
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
              <ArticleCard
                post={post}
                categoryName={getBlogCategory(post.category)?.name}
                headingLevel={3}
              />
            </li>
          ))}
        </ul>
      </Section>
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Blog", path: "/blog" }]))} />
    </>
  );
}

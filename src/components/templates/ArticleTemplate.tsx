import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { RelatedLinks } from "@/components/sections/shared/Related";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/content/blog/posts";
import { getBlogCategory, getIndustries, getSolutions, resolveSlugs } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { blogPosting, breadcrumbList } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/format-date";

/** Article page (spec FR-090): header → featured image → body → related links → related posts → CTA. */
export function ArticleTemplate({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const category = getBlogCategory(post.category);
  const path = `/blog/${post.slug}`;
  const { Content } = post;
  const relatedLinks = [
    ...resolveSlugs(post.relatedSolutions, getSolutions()).map((s) => ({
      name: s.name,
      href: `/solutions/${s.slug}`,
      summary: s.summary,
    })),
    ...resolveSlugs(post.relatedIndustries, getIndustries()).map((i) => ({
      name: i.name,
      href: `/industries/${i.slug}`,
      summary: i.summary,
    })),
  ];

  return (
    <>
      <section className="surface-gray pt-8 pb-10 md:pt-10">
        <Container size="narrow">
          <Breadcrumbs
            trail={buildTrail([
              { name: "Blog", path: "/blog" },
              { name: post.title, path },
            ])}
          />
          <header className="mt-8">
            {category ? (
              <Link href={`/blog/category/${category.slug}`} className="eyebrow hover:underline">
                {category.name}
              </Link>
            ) : null}
            <h1 className="mt-3 text-h1">{post.title}</h1>
            <p className="mt-5 text-lead text-ink-muted">{post.excerpt}</p>
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-small text-ink-muted">
              {post.author ? <span>By {post.author.name}</span> : null}
              <span>
                Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
              {post.updatedAt ? (
                <span>
                  Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              ) : null}
            </p>
          </header>
        </Container>
      </section>

      <section className="pb-section surface-white" aria-label="Article">
        <Container size="narrow">
          <Image
            src={post.featuredImage.src}
            alt={post.featuredImage.alt}
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="-mt-2 h-auto w-full rounded-panel border border-line md:mt-8"
          />
          <div className="prose-udesign mt-10">
            <Content />
          </div>
          {post.tags.length ? (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-pill bg-surface-gray px-3 py-1 text-small text-ink-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>

      <RelatedLinks
        id="related-topics"
        heading="Related solutions and industries"
        surface="gray"
        links={relatedLinks}
      />

      {related.length ? (
        <Section surface="white" id="related-articles" labelledBy="related-articles-heading">
          <SectionHeading id="related-articles-heading" level={2} title="Related articles" />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <ArticleCard
                  post={p}
                  categoryName={getBlogCategory(p.category)?.name}
                  headingLevel={3}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBanner
        title="Want to discuss your own processes?"
        text="Tell us how your business works today. We will suggest a practical way forward in a free consultation."
        context={{ source: path }}
      />
      <JsonLd data={blogPosting({ ...post, imageUrl: post.featuredImage.src.src })} />
      <JsonLd
        data={breadcrumbList(
          buildTrail([
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        )}
      />
    </>
  );
}

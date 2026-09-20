import Image from "next/image";
import Link from "@/components/ui/AppLink";
import { Badge } from "@/components/ui/Badge";
import { Card, stretchedLink } from "@/components/ui/Card";
import type { BlogPostMeta } from "@/types/content";
import { formatDate } from "@/lib/utils/format-date";

/** Article listing tile with one stretched link (spec FR-090). */
export function ArticleCard({
  post,
  categoryName,
  headingLevel = 2,
}: {
  post: BlogPostMeta;
  categoryName?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Card variant="link" padding="none" className="h-full overflow-hidden" as="article">
      <div className="relative aspect-16/9 overflow-hidden rounded-t-card bg-surface-gray">
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 92vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          {categoryName ? <Badge variant="category">{categoryName}</Badge> : null}
          <time dateTime={post.publishedAt} className="text-small text-ink-muted">
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <Heading className="mt-3 text-h4">
          <Link href={`/blog/${post.slug}`} className={stretchedLink}>
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-ink-muted">{post.excerpt}</p>
      </div>
    </Card>
  );
}

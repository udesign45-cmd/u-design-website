import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/sections/shared/PageHero";
import type { LegalPage } from "@/content/legal";
import { isVisible } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils/format-date";

/** Legal page layout. Drafts are visible only in preview and carry a visible notice. */
export function LegalTemplate({ page }: { page: LegalPage | undefined }) {
  if (!page || !isVisible(page)) notFound();
  const { Content } = page;
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: page.title, path: `/${page.slug}` }])}
        title={page.title}
        intro={`Last updated ${formatDate(page.updatedAt)}.`}
        primaryCta={null}
        surface="gray"
      />
      <section className="surface-white py-section-compact" aria-label={page.title}>
        <Container size="narrow">
          {page.status === "draft" ? (
            <p
              role="note"
              className="mb-8 rounded-card border-2 border-ink/20 bg-surface-gray p-4 text-small font-semibold"
            >
              DRAFT: this text requires U Design and legal approval before publication (Q-8).
            </p>
          ) : null}
          <div className="prose-udesign">
            <Content />
          </div>
        </Container>
      </section>
      <JsonLd data={breadcrumbList(buildTrail([{ name: page.title, path: `/${page.slug}` }]))} />
    </>
  );
}

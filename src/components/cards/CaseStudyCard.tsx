import Link from "@/components/ui/AppLink";
import { Card, stretchedLink } from "@/components/ui/Card";
import type { Project } from "@/types/content";

/** Only for client projects with verified results (constitution II); otherwise renders nothing. */
export function CaseStudyCard({ project, href }: { project: Project; href: string }) {
  if (project.type !== "client" || !project.results?.length || !project.client) return null;
  return (
    <Card variant="link" as="article">
      <p className="text-small font-medium text-ink-muted">{project.client.name}</p>
      <h3 className="mt-2 text-h4">
        <Link href={href} className={stretchedLink}>
          {project.title}
        </Link>
      </h3>
      <dl className="mt-5 grid grid-cols-3 gap-4">
        {project.results.slice(0, 3).map((r) => (
          <div key={r.label}>
            <dt className="text-small text-ink-muted">{r.label}</dt>
            <dd className="font-heading text-h4 font-bold">{r.value}</dd>
          </div>
        ))}
      </dl>
      <span aria-hidden="true" className="mt-5 text-small font-semibold">
        View Case Study
      </span>
    </Card>
  );
}

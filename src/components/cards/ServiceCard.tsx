import Link from "@/components/ui/AppLink";
import { Card, stretchedLink } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";

type ServiceCardProps = {
  name: string;
  benefit: string;
  icon: IconName;
  href?: string;
  headingLevel?: 3 | 4;
};

/**
 * Service tile used on home, hubs and marketing pages. Links only when a page
 * exists. On phones the icon sits beside the title to keep long lists compact.
 */
export function ServiceCard({ name, benefit, icon, href, headingLevel = 3 }: ServiceCardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <Card variant={href ? "link" : "default"} className="h-full">
      <div className="flex items-center gap-3 sm:block">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-green-deep text-brand-green sm:mb-5 sm:size-11">
          <Icon name={icon} size={22} />
        </span>
        <Heading className="text-h4">
          {href ? (
            <Link href={href} className={stretchedLink}>
              {name}
            </Link>
          ) : (
            name
          )}
        </Heading>
      </div>
      <p className="mt-2 text-ink-muted">{benefit}</p>
      {href ? (
        <span
          aria-hidden="true"
          className="mt-auto hidden items-center gap-1 pt-5 text-small font-semibold text-ink sm:inline-flex"
        >
          Learn more <Icon name="arrow-right" size={16} className="text-brand-green-dark" />
        </span>
      ) : null}
    </Card>
  );
}

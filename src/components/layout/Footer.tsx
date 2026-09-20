import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { getNavigation } from "@/lib/content";
import { Container } from "./Container";
import { Logo } from "./Logo";

const platformNames = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
} as const;

/** Footer: only contact details and social links that U Design has provided (FR-006, FR-071). */
export function Footer() {
  const { footer } = getNavigation();
  const hasContact = Boolean(site.email || site.phone || site.location);
  const year = new Date().getFullYear();

  return (
    <footer className="surface-ink">
      <Container className="py-section-compact">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 font-heading text-h4 font-semibold text-brand-green">
              {site.tagline}
            </p>
            <p className="mt-3 text-fg-muted">{site.positioning}.</p>
            {hasContact ? (
              <address className="mt-6 grid gap-2 not-italic">
                {site.email ? (
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 hover:underline"
                    data-track="contact_click"
                    data-track-channel="email"
                  >
                    <Icon name="mail" size={18} className="text-brand-green" />
                    {site.email}
                  </a>
                ) : null}
                {site.phone ? (
                  <a
                    href={`tel:${site.phone.e164}`}
                    className="inline-flex items-center gap-2 hover:underline"
                    data-track="contact_click"
                    data-track-channel="phone"
                  >
                    <Icon name="phone" size={18} className="text-brand-green" />
                    {site.phone.display}
                  </a>
                ) : null}
                {site.location ? (
                  <span className="inline-flex items-center gap-2">
                    <Icon name="map-pin" size={18} className="text-brand-green" />
                    {[site.location.address, site.location.city, site.location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                ) : null}
              </address>
            ) : null}
            {site.socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {site.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex min-h-11 items-center gap-2 rounded-control border border-fg/20 px-3 text-small hover:border-fg"
                      data-track="contact_click"
                      data-track-channel={s.platform}
                    >
                      <Icon name="link" size={16} />
                      {platformNames[s.platform]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-2 xl:grid-cols-5"
          >
            {footer.map((group) => (
              <div key={group.title}>
                <h2 className="font-sans text-small font-semibold tracking-wide text-white uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 grid gap-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-small text-fg-muted hover:text-white hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-fg/15 pt-6 text-small text-fg-muted sm:flex-row sm:justify-between">
          <p>© {year} U Design. All rights reserved.</p>
          <p>{site.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}

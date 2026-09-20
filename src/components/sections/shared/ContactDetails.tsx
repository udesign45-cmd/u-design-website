import { Icon } from "@/components/ui/Icon";
import type { SiteProfile } from "@/types/content";

const platformNames = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
} as const;

/** Only the channels U Design has provided (spec FR-071, FR-072). Nothing is invented. */
export function ContactDetails({ site }: { site: SiteProfile }) {
  const hasAny = Boolean(
    site.email || site.phone || site.location || site.hours || site.socials.length,
  );

  return (
    <div className="rounded-panel border border-line bg-white p-6 text-ink md:p-8">
      <h2 className="text-h4">Contact details</h2>
      {!hasAny ? (
        <p className="mt-3 text-ink-muted">Use the form to reach our team.</p>
      ) : (
        <ul className="mt-5 grid gap-4">
          {site.email ? (
            <li className="flex items-start gap-3">
              <Icon name="mail" size={20} className="mt-0.5 text-brand-green-dark" />
              <a
                href={`mailto:${site.email}`}
                className="link-inline"
                data-track="contact_click"
                data-track-channel="email"
              >
                {site.email}
              </a>
            </li>
          ) : null}
          {site.phone ? (
            <li className="flex items-start gap-3">
              <Icon name="phone" size={20} className="mt-0.5 text-brand-green-dark" />
              <a
                href={`tel:${site.phone.e164}`}
                className="link-inline"
                data-track="contact_click"
                data-track-channel="phone"
              >
                {site.phone.display}
              </a>
            </li>
          ) : null}
          {site.location ? (
            <li className="flex items-start gap-3">
              <Icon name="map-pin" size={20} className="mt-0.5 text-brand-green-dark" />
              <span>
                {[site.location.address, site.location.city, site.location.country]
                  .filter(Boolean)
                  .join(", ")}
                {site.location.mapUrl ? (
                  <>
                    {" "}
                    <a
                      href={site.location.mapUrl}
                      className="link-inline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View map
                    </a>
                  </>
                ) : null}
              </span>
            </li>
          ) : null}
          {site.hours ? (
            <li className="flex items-start gap-3">
              <Icon name="clock" size={20} className="mt-0.5 text-brand-green-dark" />
              <span>{site.hours}</span>
            </li>
          ) : null}
          {site.socials.length ? (
            <li className="flex flex-wrap gap-2 pt-2">
              {site.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-3 text-small hover:border-ink"
                  data-track="contact_click"
                  data-track-channel={s.platform}
                >
                  <Icon name="link" size={16} />
                  {platformNames[s.platform]}
                </a>
              ))}
            </li>
          ) : null}
        </ul>
      )}
      {site.responseTime ? (
        <p className="mt-6 border-t border-line pt-5 text-small text-ink-muted">
          We usually respond {site.responseTime}.
        </p>
      ) : null}
    </div>
  );
}

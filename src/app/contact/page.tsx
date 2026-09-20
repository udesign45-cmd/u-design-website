import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Section } from "@/components/layout/Section";
import { ContactDetails } from "@/components/sections/shared/ContactDetails";
import { PageHero } from "@/components/sections/shared/PageHero";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import { getFormOptions, legalHref } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.contact, path: "/contact" });

const nextSteps = [
  "We review your request and the details of your business.",
  "We contact you to understand your workflow and goals.",
  "We suggest a practical approach and next steps.",
];

/** Contact page: consultation form + configured contact details (spec FR-071, FR-082). Fully static. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "Contact", path: "/contact" }])}
        eyebrow="Contact"
        title="Get Free Consultation"
        intro="Tell us how your business works today and what you would like to improve. We will review your request and suggest a practical next step."
        primaryCta={null}
      />
      <Section surface="gray" id="consultation" labelledBy="consultation-heading">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-panel border border-line bg-white p-6 shadow-card md:p-10 lg:col-span-2">
            <h2 id="consultation-heading" className="text-h3">
              Request your free consultation
            </h2>
            <p className="mt-2 text-ink-muted">
              Fields marked (required) are needed to respond to your request.
            </p>
            <div className="mt-8">
              <ConsultationForm
                options={getFormOptions()}
                fallback={{ email: site.email, phone: site.phone }}
                privacyHref={legalHref("privacy-policy")}
              />
            </div>
          </div>
          <div className="grid content-start gap-6">
            <ContactDetails site={site} />
            <div className="rounded-panel surface-deep p-6 md:p-8">
              <h2 className="text-h4">What happens next</h2>
              <ol className="mt-5 grid gap-4">
                {nextSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-brand-green text-small font-bold text-ink">
                      {i + 1}
                    </span>
                    <span className="text-fg-muted">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-start gap-2 text-small text-fg-muted">
                <Icon
                  name="shield-check"
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-green-dark"
                />
                Your details are used only to respond to your enquiry.
              </p>
            </div>
          </div>
        </div>
      </Section>
      <JsonLd data={breadcrumbList(buildTrail([{ name: "Contact", path: "/contact" }]))} />
    </>
  );
}

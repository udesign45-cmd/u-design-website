import { Section } from "@/components/layout/Section";
import { LogoCloud } from "@/components/ui/LogoCloud";
import { home } from "@/content/home";
import { getApprovedLogos } from "@/lib/content";

/** Renders only with at least 3 real, approved client logos (FR-012, constitution II). */
export function TrustLogos() {
  const logos = getApprovedLogos();
  if (logos.length < 3) return null;
  return (
    <Section surface="gray" spacing="compact" labelledBy="trust-heading">
      <h2
        id="trust-heading"
        className="text-center text-small font-semibold tracking-wide text-ink-muted uppercase"
      >
        {home.trust.heading}
      </h2>
      <div className="mt-8">
        <LogoCloud logos={logos} />
      </div>
    </Section>
  );
}

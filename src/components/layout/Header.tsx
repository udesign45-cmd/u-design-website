import { ButtonLink } from "@/components/ui/Button";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { getNavigation } from "@/lib/content";
import { Container } from "./Container";
import { Logo } from "./Logo";

/** Sticky site header with persistent consultation CTA (spec FR-001, FR-004). */
export function Header() {
  const { cta } = getNavigation();
  return (
    <header className="sticky top-0 z-40 border-b border-line surface-white">
      <Container className="flex h-(--header-height) items-center justify-between gap-4">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <ButtonLink
            href={cta.href}
            size="md"
            className="px-3 sm:px-4 lg:px-5"
            track={{ event: "cta_click", label: cta.label, location: "header" }}
          >
            {cta.label}
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

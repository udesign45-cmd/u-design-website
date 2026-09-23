import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { template: "%s | U Design Admin", default: "U Design Admin" },
  robots: { index: false, follow: false },
};

/**
 * /admin shares the site's single root layout (src/app/layout.tsx), which
 * always renders the public Header/Footer around {children} — Next.js
 * doesn't support a second, differently-chromed root without route groups,
 * and that approach was tried and reverted here: it made Next.js
 * hash-suffix the robots.txt and opengraph-image routes to disambiguate
 * between two roots, breaking their public URLs (see git history). This
 * hides that chrome by CSS instead; AdminShell (in the (dashboard) layout)
 * provides /admin's actual chrome.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        body > header, body > footer, body > a[href="#main"] { display: none !important; }
      `}</style>
      {children}
    </>
  );
}

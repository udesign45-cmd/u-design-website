import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { inter, poppins } from "@/app/fonts";
import { Analytics } from "udesign-analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { organization } from "@/lib/seo/jsonld";
import { robotsFor, SITE_NAME } from "@/lib/seo/metadata";
import { gaId, metaPixelId, siteUrl } from "@/lib/utils/env.public";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "U Design | Digital Solutions That Help Businesses Grow",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "U Design builds custom software, ERP, CRM, dashboards and automation, and helps businesses grow through digital marketing. Build. Market. Grow.",
  applicationName: SITE_NAME,
  ...robotsFor(),
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#003d1a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd data={organization(site, site.logo?.src.src)} />
        {/* Aliased to a no-op at build time when analytics is not configured (next.config.ts). */}
        {gaId || metaPixelId ? <Analytics gaId={gaId} metaPixelId={metaPixelId} /> : null}
      </body>
    </html>
  );
}

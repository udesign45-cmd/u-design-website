import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { redirects as contentRedirects } from "./src/content/redirects";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy (plan AD-19). Static rendering rules out nonces, so
 * inline scripts are allowed; everything else is locked to 'self'. Third-party
 * origins are appended only when their feature is configured (T189).
 */
export function buildCsp(env: NodeJS.ProcessEnv = process.env): string {
  const script = ["'self'", "'unsafe-inline'"];
  const connect = ["'self'"];
  const img = ["'self'", "data:", "blob:"];
  const frame: string[] = [];

  if (isDev) {
    script.push("'unsafe-eval'");
    connect.push("ws:");
  }
  if (env.NEXT_PUBLIC_GA_ID) {
    const ga = ["https://www.googletagmanager.com", "https://www.google-analytics.com"];
    script.push(...ga);
    connect.push(...ga, "https://*.google-analytics.com");
    img.push(...ga);
  }
  if (env.NEXT_PUBLIC_META_PIXEL_ID) {
    script.push("https://connect.facebook.net");
    connect.push("https://www.facebook.com");
    img.push("https://www.facebook.com");
  }
  if (env.TURNSTILE_SITE_KEY) {
    script.push("https://challenges.cloudflare.com");
    frame.push("https://challenges.cloudflare.com");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${script.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${img.join(" ")}`,
    "font-src 'self'",
    `connect-src ${connect.join(" ")}`,
    frame.length ? `frame-src ${frame.join(" ")}` : "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // HSTS only where the site is served over TLS; browsers ignore it on http anyway.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: buildCsp() },
];

const analyticsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID,
);

const nextConfig: NextConfig = {
  // A second output directory lets the e2e "blog-gate" build (no draft content) run
  // alongside the main preview build without either overwriting the other.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  // Without an analytics ID, swap the analytics islands for a no-op so no
  // analytics JavaScript is bundled at all (plan AD-09, task T187).
  turbopack: {
    resolveAlias: {
      "udesign-analytics": analyticsEnabled
        ? "./src/components/analytics/Analytics.tsx"
        : "./src/components/analytics/AnalyticsOff.tsx",
    },
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return contentRedirects.map(({ source, destination, permanent }) => ({
      source,
      destination,
      permanent,
    }));
  },
};

// MDX for legal pages and blog articles (plan AD-08). MDX files are imported, not routed.
const withMDX = createMDX({});

export default withMDX(nextConfig);

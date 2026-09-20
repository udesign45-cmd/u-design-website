import { Inter, Poppins } from "next/font/google";

/** Headings: Poppins 600/700 only (constitution VII: ≤ 3 weights per family). */
export const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

/** Body/UI: Inter variable font (400/500/600 used). */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Not preloaded: body text renders immediately in the metric-adjusted fallback,
  // leaving bandwidth for the heading font used by the LCP element (plan AD-12).
  preload: false,
});

import { about } from "@/content/about";
import { site } from "@/content/site";
import { getIndustries, getMarketingServices, getSolutions, hasPage } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo/site-url";

/**
 * A curated, plain-text summary for LLM/AI crawlers (GEO), built entirely from
 * already-published content — nothing here is stated anywhere else on the site
 * is invented for this file (constitution II).
 */
export function GET() {
  const solutions = getSolutions();
  const marketing = getMarketingServices();
  const industries = getIndustries();

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.positioning}.`,
    "",
    ...about.who.body,
    "",
    "## Business Software & Digital Solutions",
    ...solutions.map(
      (s) => `- [${s.name}](${absoluteUrl(hasPage(s) ? `/solutions/${s.slug}` : "/solutions")}): ${s.summary}`,
    ),
    "",
    "## Digital Marketing & Growth",
    ...marketing.map(
      (m) =>
        `- [${m.name}](${absoluteUrl(hasPage(m) ? `/digital-marketing/${m.slug}` : "/digital-marketing")}): ${m.summary}`,
    ),
    "",
    "## Industries served",
    ...industries.map(
      (i) =>
        `- [${i.name}](${absoluteUrl(hasPage(i) ? `/industries/${i.slug}` : "/industries")}): ${i.summary}`,
    ),
    "",
    "## Key pages",
    `- [Solutions](${absoluteUrl("/solutions")})`,
    `- [Digital Marketing](${absoluteUrl("/digital-marketing")})`,
    `- [Industries](${absoluteUrl("/industries")})`,
    `- [Portfolio](${absoluteUrl("/portfolio")})`,
    `- [About](${absoluteUrl("/about")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * Content integrity rules (data-model.md › Integrity rules). Each rule is a
 * pure function returning a list of violations so it can be tested against both
 * the real content and failing fixtures.
 */
import type {
  ClientLogo,
  Industry,
  MarketingService,
  Project,
  Solution,
  Stat,
  Testimonial,
} from "@/types/content";

export type ContentSet = {
  solutions: Solution[];
  marketing: MarketingService[];
  industries: Industry[];
  projects: Project[];
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const APPROVED_CTA_LABELS = [
  "Get Free Consultation",
  "Choose the Plan",
  "View Our Solutions",
  "View Case Study",
  "Discuss Your Business",
  "Discuss Your Business Process",
  "Grow Your Business",
] as const;

export const BANNED_WORDS = [
  "innovative",
  "cutting-edge",
  "cutting edge",
  "revolutionary",
  "best-in-class",
  "guaranteed",
  "guarantee",
  "world-class",
  "synergy",
] as const;

export const PLACEHOLDER_MARKERS = ["TODO", "TBD", "PLACEHOLDER", "lorem", "example.com"] as const;

/** Collects every string value in an object tree, skipping static image data. */
export function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, out));
  } else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (key === "src") continue; // StaticImageData
      collectStrings(v, out);
    }
  }
  return out;
}

// Rule 0 — slugs are lowercase kebab-case and unique per collection
export function checkSlugs(set: ContentSet): string[] {
  const errors: string[] = [];
  for (const [name, list] of Object.entries(set) as [string, { slug: string }[]][]) {
    const seen = new Set<string>();
    for (const { slug } of list) {
      if (!SLUG.test(slug)) errors.push(`${name}: invalid slug "${slug}"`);
      if (seen.has(slug)) errors.push(`${name}: duplicate slug "${slug}"`);
      seen.add(slug);
    }
  }
  return errors;
}

// Rule 1 — every slug reference resolves
export function checkReferences(set: ContentSet): string[] {
  const errors: string[] = [];
  const ind = new Set(set.industries.map((i) => i.slug));
  const sol = new Set(set.solutions.map((s) => s.slug));
  const proj = new Set(set.projects.map((p) => p.slug));
  const check = (from: string, slugs: string[], target: Set<string>, kind: string) =>
    slugs.forEach((s) => {
      if (!target.has(s)) errors.push(`${from} references unknown ${kind} "${s}"`);
    });

  for (const s of [...set.solutions, ...set.marketing]) {
    if (!s.hasPage) continue;
    check(`service:${s.slug}`, s.industries, ind, "industry");
    check(`service:${s.slug}`, s.projects, proj, "project");
  }
  for (const i of set.industries) {
    if (!i.hasPage) continue;
    check(`industry:${i.slug}`, i.solutions, sol, "solution");
    check(`industry:${i.slug}`, i.projects, proj, "project");
  }
  for (const p of set.projects) {
    check(`project:${p.slug}`, [p.industry], ind, "industry");
    check(`project:${p.slug}`, p.solutionTypes, sol, "solution");
  }
  return errors;
}

type SeoEntry = { id: string; title: string; description: string };

export function seoEntries(set: ContentSet): SeoEntry[] {
  const entries: SeoEntry[] = [];
  for (const s of [...set.solutions, ...set.marketing, ...set.industries]) {
    if (s.hasPage) entries.push({ id: s.slug, ...s.seo });
  }
  for (const p of set.projects) {
    if (p.seo) entries.push({ id: `project:${p.slug}`, ...p.seo });
  }
  return entries;
}

// Rule 2 — SEO titles/descriptions unique and within length limits
export function checkSeo(entries: SeoEntry[]): string[] {
  const errors: string[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const e of entries) {
    if (e.title.length < 30 || e.title.length > 60)
      errors.push(`${e.id}: title length ${e.title.length} (30–60)`);
    if (e.description.length < 70 || e.description.length > 160)
      errors.push(`${e.id}: description length ${e.description.length} (70–160)`);
    const t = e.title.toLowerCase();
    const d = e.description.toLowerCase();
    if (titles.has(t)) errors.push(`${e.id}: duplicate title with ${titles.get(t)}`);
    if (descriptions.has(d))
      errors.push(`${e.id}: duplicate description with ${descriptions.get(d)}`);
    titles.set(t, e.id);
    descriptions.set(d, e.id);
  }
  return errors;
}

// Rule 3 — concept projects have no client/results; results carry verification
export function checkProjectIntegrity(projects: Project[]): string[] {
  const errors: string[] = [];
  for (const p of projects) {
    const raw = p as Record<string, unknown>;
    if (p.type === "concept" && (raw.client !== undefined || raw.results !== undefined)) {
      errors.push(`project:${p.slug} is a concept but has client or results`);
    }
    if (p.type === "client") {
      for (const r of p.results ?? []) {
        if (!r.verifiedBy.trim() || !r.verifiedOn.trim())
          errors.push(`project:${p.slug} has an unverified result`);
      }
      if (p.client && p.client.permissionConfirmed !== true)
        errors.push(`project:${p.slug} client without permission`);
    }
  }
  return errors;
}

// Rule 4 — proof filters only let verified/approved items through
export function checkProofFilters(
  testimonials: Testimonial[],
  stats: Stat[],
  logos: ClientLogo[],
): string[] {
  const errors: string[] = [];
  if (testimonials.some((t) => !t.verified)) errors.push("unverified testimonial returned");
  if (stats.some((s) => !s.verified || !s.source.trim())) errors.push("unverified stat returned");
  if (logos.some((l) => !l.permissionConfirmed)) errors.push("logo without permission returned");
  return errors;
}

// Rule 5 — projects with narrative content have ≥ 1 captioned screenshot
export function checkScreenshots(projects: Project[]): string[] {
  const errors: string[] = [];
  for (const p of projects) {
    if (!p.seo) continue;
    if (p.screenshots.length === 0) errors.push(`project:${p.slug} has no screenshots`);
    p.screenshots.forEach((s, i) => {
      if (!s.caption.trim()) errors.push(`project:${p.slug} screenshot ${i} has no caption`);
      if (!s.image.decorative && s.image.alt.trim().length < 5)
        errors.push(`project:${p.slug} screenshot ${i} alt too short`);
    });
  }
  return errors;
}

// Rule 6 — no placeholder text or placeholder assets in published entries
/**
 * The invariant is that no placeholder ever reaches a visitor — not that no published
 * entry may mention one. An entry whose own page is withheld *because* of its
 * placeholders (see `projectHasPage`) is the gate working, so it is reported as a
 * warning. Pass `reachable: false` for those entries.
 */
export function checkPlaceholders(
  entries: { id: string; status: string; value: unknown; reachable?: boolean }[],
): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const e of entries) {
    const text = collectStrings(e.value).join("\n");
    const marker = PLACEHOLDER_MARKERS.find((m) =>
      m === "lorem" ? /lorem/i.test(text) : new RegExp(`\\b${m.replace(".", "\\.")}\\b`).test(text),
    );
    const usesPlaceholderAsset = JSON.stringify(e.value, (k, v) =>
      k === "src" ? undefined : v,
    ).includes('"isPlaceholder":true');
    const problem = marker
      ? `contains "${marker}"`
      : usesPlaceholderAsset
        ? "uses a placeholder asset"
        : null;
    if (!problem) continue;
    const reachesVisitors = e.status === "published" && e.reachable !== false;
    (reachesVisitors ? errors : warnings).push(`${e.id} ${problem}`);
  }
  return { errors, warnings };
}

// Rule 7 — CTA labels come from the approved set
export function checkCtaLabels(labels: string[]): string[] {
  return labels
    .filter((l) => !(APPROVED_CTA_LABELS as readonly string[]).includes(l))
    .map((l) => `unapproved CTA label "${l}"`);
}

// Rule 8 — banned buzzwords / guarantee language
export function checkBannedWords(
  entries: { id: string; value: unknown }[],
  allowlist: string[] = [],
): string[] {
  const errors: string[] = [];
  for (const e of entries) {
    const text = collectStrings(e.value).join("\n").toLowerCase();
    for (const word of BANNED_WORDS) {
      if (allowlist.includes(`${e.id}:${word}`)) continue;
      if (new RegExp(`\\b${word}\\b`).test(text)) errors.push(`${e.id} uses "${word}"`);
    }
  }
  return errors;
}

// Rule 9 — industry pages are genuinely distinct (FR-042)
function trigrams(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const grams = new Set<string>();
  for (let i = 0; i + 2 < words.length; i++)
    grams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  return grams;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  a.forEach((g) => {
    if (b.has(g)) inter++;
  });
  return inter / (a.size + b.size - inter);
}

export function checkIndustryDistinctness(industries: Industry[], threshold = 0.35): string[] {
  const errors: string[] = [];
  const pages = industries.filter((i): i is Extract<Industry, { hasPage: true }> => i.hasPage);
  const grams = pages.map((i) => ({
    slug: i.slug,
    set: trigrams(collectStrings([i.challenges, i.features]).join(" ")),
  }));
  for (let a = 0; a < grams.length; a++) {
    for (let b = a + 1; b < grams.length; b++) {
      const ga = grams[a]!;
      const gb = grams[b]!;
      const score = jaccard(ga.set, gb.set);
      if (score >= threshold)
        errors.push(`${ga.slug} and ${gb.slug} similarity ${score.toFixed(2)}`);
    }
  }
  return errors;
}

// Rule 11 — bidirectional relations (task T173)
export function checkBidirectional(set: ContentSet): string[] {
  const errors: string[] = [];
  const solutionPages = set.solutions.filter(
    (s): s is Extract<Solution, { hasPage: true }> => s.hasPage,
  );
  const industryPages = set.industries.filter(
    (i): i is Extract<Industry, { hasPage: true }> => i.hasPage,
  );

  for (const ind of industryPages) {
    for (const solSlug of ind.solutions) {
      const sol = solutionPages.find((s) => s.slug === solSlug);
      if (sol && !sol.industries.includes(ind.slug))
        errors.push(
          `industry:${ind.slug} lists ${solSlug}, but ${solSlug} does not list ${ind.slug}`,
        );
    }
  }
  for (const sol of solutionPages) {
    for (const indSlug of sol.industries) {
      const ind = industryPages.find((i) => i.slug === indSlug);
      if (ind && !ind.solutions.includes(sol.slug))
        errors.push(
          `solution:${sol.slug} lists ${indSlug}, but ${indSlug} does not list ${sol.slug}`,
        );
    }
  }
  for (const p of set.projects) {
    const ind = industryPages.find((i) => i.slug === p.industry);
    if (ind && !ind.projects.includes(p.slug))
      errors.push(`project:${p.slug} industry ${p.industry} does not list it`);
    for (const solSlug of p.solutionTypes) {
      const sol = solutionPages.find((s) => s.slug === solSlug);
      if (sol && !sol.projects.includes(p.slug))
        errors.push(`project:${p.slug} solution ${solSlug} does not list it`);
    }
  }
  for (const page of [...solutionPages, ...industryPages]) {
    const links =
      "category" in page
        ? page.industries.length + page.projects.length
        : page.solutions.length + page.projects.length;
    if (links < 2) errors.push(`${page.slug} has fewer than 2 related links`);
  }
  return errors;
}

// Rule 12 — meaningful alt text on every content image (task T174)
export function checkImageAlts(entries: { id: string; value: unknown }[]): string[] {
  const errors: string[] = [];
  const visit = (value: unknown, id: string) => {
    if (Array.isArray(value)) return value.forEach((v) => visit(v, id));
    if (!value || typeof value !== "object") return;
    const obj = value as Record<string, unknown>;
    if ("src" in obj && "alt" in obj && typeof obj.alt === "string") {
      const alt = obj.alt.trim();
      if (obj.decorative === true) {
        if (alt !== "") errors.push(`${id}: decorative image must have empty alt`);
      } else if (alt.length < 5 || /^(image|picture|photo)\b/i.test(alt)) {
        errors.push(`${id}: weak alt text "${alt}"`);
      }
      return;
    }
    Object.values(obj).forEach((v) => visit(v, id));
  };
  entries.forEach((e) => visit(e.value, e.id));
  return errors;
}

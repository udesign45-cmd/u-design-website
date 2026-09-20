/**
 * Content model (specs/001-corporate-website/data-model.md).
 * The compiler enforces the constitution's content-integrity rules where it can:
 * approved CTA labels only, mandatory alt text and captions, and no client
 * names or results on concept projects.
 */
import type { StaticImageData } from "next/image";
import type { IconName } from "@/components/ui/Icon";

export type { IconName };

/** Lowercase kebab-case, matching `^[a-z0-9]+(-[a-z0-9]+)*$`; unique within its collection. */
export type Slug = string;

/** Only `published` entries render in production (plan AD-02). */
export type Status = "draft" | "published";

/** Title 30–60 chars, description 70–160 chars, both unique site-wide (integrity rule 2). */
export type Seo = {
  title: string;
  description: string;
  ogImage?: StaticImage;
};

/** The only CTA labels the site may use (constitution IX, spec FR-005). */
export type CtaLabel =
  | "Get Free Consultation"
  | "View Our Solutions"
  | "View Case Study"
  | "Discuss Your Business"
  | "Discuss Your Business Process"
  | "Grow Your Business";

export type Cta = {
  label: CtaLabel;
  href: string;
  variant: "primary" | "secondary";
};

/** A static image import plus mandatory alt text ("" only when `decorative`). */
export type StaticImage = {
  src: StaticImageData;
  alt: string;
  decorative?: boolean;
  /** Preview-only placeholder; can never be published (integrity rule 6, task T121). */
  isPlaceholder?: boolean;
};

/** Caption is mandatory (spec FR-053). */
export type Screenshot = {
  image: StaticImage;
  caption: string;
  module?: string;
};

/** Short structured copy as paragraphs. Long-form content uses MDX. */
export type RichText = string[];

export type TitledText = { title: string; description: string };

export type Faq = { question: string; answer: string };

// ---------------------------------------------------------------------------
// Services: software solutions and marketing services
// ---------------------------------------------------------------------------

type ServiceBase = {
  slug: Slug;
  name: string;
  /** One-line business benefit, ≤ 140 chars. */
  summary: string;
  icon: IconName;
  order: number;
  status: Status;
};

type ServicePageFields = {
  hero: { heading: string; intro: string };
  problem: { heading: string; points: TitledText[] };
  approach: { heading: string; body: RichText };
  /** At least 4. */
  features: TitledText[];
  /** At least 3; business outcomes. */
  benefits: TitledText[];
  useCases: string[];
  industries: Slug[];
  projects: Slug[];
  faqs?: Faq[];
  seo: Seo;
};

export type SolutionSummary = ServiceBase & { category: "software"; hasPage: false };
export type SolutionPage = ServiceBase & {
  category: "software";
  hasPage: true;
} & ServicePageFields;
export type Solution = SolutionSummary | SolutionPage;

export type CoveredService = { name: string; benefit: string };

type MarketingBase = ServiceBase & {
  category: "marketing";
  /** Spec service names covered by this entry, each with a benefit line. */
  covers: CoveredService[];
};

export type MarketingServiceSummary = MarketingBase & { hasPage: false };
export type MarketingServicePage = MarketingBase & {
  hasPage: true;
  /** Business outcomes; never guarantees (FR-061). */
  outcomes: TitledText[];
} & ServicePageFields;
export type MarketingService = MarketingServiceSummary | MarketingServicePage;

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

type IndustryBase = {
  slug: Slug;
  name: string;
  /** Workflow keywords for cards (spec FR-040). */
  shortWorkflows: string[];
  summary: string;
  icon: IconName;
  /** Manufacturing = 1 (FR-043). */
  priority: number;
  status: Status;
};

export type IndustrySummary = IndustryBase & { hasPage: false };
export type IndustryPage = IndustryBase & {
  hasPage: true;
  hero: { heading: string; intro: string };
  /** At least 3, industry-specific (FR-042). */
  challenges: TitledText[];
  workflows: { name: string; description: string }[];
  solutions: Slug[];
  features: TitledText[];
  benefits: TitledText[];
  projects: Slug[];
  seo: Seo;
};
export type Industry = IndustrySummary | IndustryPage;

// ---------------------------------------------------------------------------
// Projects (portfolio)
// ---------------------------------------------------------------------------

type ProjectBase = {
  slug: Slug;
  title: string;
  industry: Slug;
  industryLabel?: string;
  solutionTypes: Slug[];
  summary: string;
  modules: { name: string; description: string }[];
  challenge?: RichText;
  solution?: RichText;
  businessApplication?: RichText;
  /** At least 1 required for a project page (integrity rule 5). */
  screenshots: Screenshot[];
  cover?: StaticImage;
  technologies?: string[];
  featured: boolean;
  status: Status;
  seo?: Seo;
};

export type VerifiedResult = {
  label: string;
  value: string;
  verifiedBy: string;
  verifiedOn: string;
};

/** Concept/demo work: client identity and results are impossible by type (FR-052). */
export type ConceptProject = ProjectBase & {
  type: "concept";
  client?: never;
  results?: never;
};

export type ClientProject = ProjectBase & {
  type: "client";
  client?: { name: string; logo?: StaticImage; permissionConfirmed: true };
  results?: VerifiedResult[];
};

export type Project = ConceptProject | ClientProject;

// ---------------------------------------------------------------------------
// Proof (rendered only when verified/approved)
// ---------------------------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: StaticImage;
  projectSlug?: Slug;
  verified: boolean;
  approvedOn: string;
};

export type Stat = {
  value: string;
  label: string;
  /** Internal evidence reference — required. */
  source: string;
  verified: boolean;
};

export type ClientLogo = {
  company: string;
  logo: StaticImage;
  url?: string;
  permissionConfirmed: boolean;
};

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export type BlogCategory = {
  slug: Slug;
  name: string;
  description: string;
  seo: Seo;
};

export type BlogPostMeta = {
  title: string;
  slug: Slug;
  excerpt: string;
  featuredImage: StaticImage;
  author?: { name: string; role?: string };
  publishedAt: string;
  updatedAt?: string;
  category: Slug;
  tags: string[];
  relatedSolutions: Slug[];
  relatedIndustries: Slug[];
  seo: Seo;
  canonical?: string;
  status: Status;
};

// ---------------------------------------------------------------------------
// Site-wide singletons
// ---------------------------------------------------------------------------

export type SocialPlatform = "linkedin" | "facebook" | "instagram" | "x" | "youtube";

export type SiteProfile = {
  name: "U Design";
  tagline: "Build. Market. Grow.";
  positioning: string;
  logo?: StaticImage;
  email?: string;
  phone?: { display: string; e164: string };
  location?: { city?: string; country?: string; address?: string; mapUrl?: string };
  socials: { platform: SocialPlatform; url: string }[];
  responseTime?: string;
  hours?: string;
};

export type Option = { value: string; label: string };

export type FormOptions = {
  industries: Option[];
  needs: (Option & { group: "software" | "marketing" | "other" })[];
  budgets: Option[];
};

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

export type Navigation = {
  primary: NavItem[];
  cta: { label: CtaLabel; href: string };
  footer: { title: string; links: NavLink[] }[];
};

export type Redirect = { source: string; destination: string; permanent: boolean };

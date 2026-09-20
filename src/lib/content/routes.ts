import { legalPages } from "@/content/legal";
import { pageSeo } from "@/content/pages-seo";
import { collectRoutes, type RouteEntry } from "@/lib/seo/routes";
import { getCategoriesWithPosts, getPublishedPosts } from "./blog";
import { getIndustryPages } from "./industries";
import { getMarketingPages } from "./marketing";
import { getProjectPages, projectHasPage } from "./projects";
import { getSolutionPages } from "./solutions";

/** All indexable, visible routes (sitemap, SEO tests, link crawl). */
export function getAllRoutes(): RouteEntry[] {
  return collectRoutes({
    pageSeo,
    solutions: getSolutionPages(),
    industries: getIndustryPages(),
    marketing: getMarketingPages(),
    projects: getProjectPages(),
    projectHasPage,
    legal: legalPages,
    posts: getPublishedPosts(),
    categories: getCategoriesWithPosts(),
  });
}

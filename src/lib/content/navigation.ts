import { legalPages } from "@/content/legal";
import { consultationCta, primaryNav } from "@/content/navigation";
import type { NavItem, NavLink, Navigation } from "@/types/content";
import { hasBlog } from "./blog";
import { isVisible } from "./core";
import { getIndustryPages } from "./industries";
import { getMarketingPages } from "./marketing";
import { getSolutionPages } from "./solutions";

function menuChildren(menu: "solutions" | "industries" | "marketing"): NavLink[] {
  switch (menu) {
    case "solutions":
      return getSolutionPages().map((s) => ({ label: s.name, href: `/solutions/${s.slug}` }));
    case "industries":
      return getIndustryPages().map((i) => ({ label: i.name, href: `/industries/${i.slug}` }));
    case "marketing":
      return getMarketingPages().map((m) => ({
        label: m.name,
        href: `/digital-marketing/${m.slug}`,
      }));
  }
}

export function getNavigation(): Navigation {
  const primary: NavItem[] = primaryNav.map((item) =>
    "menu" in item
      ? { label: item.label, href: item.href, children: menuChildren(item.menu) }
      : { label: item.label, href: item.href },
  );

  const company: NavLink[] = [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    ...(hasBlog() ? [{ label: "Blog", href: "/blog" }] : []),
    { label: "Contact", href: "/contact" },
  ];

  const footer = [
    {
      title: "Solutions",
      links: [{ label: "All solutions", href: "/solutions" }, ...menuChildren("solutions")],
    },
    {
      title: "Digital Marketing",
      links: [
        { label: "Digital marketing overview", href: "/digital-marketing" },
        ...menuChildren("marketing"),
      ],
    },
    {
      title: "Industries",
      links: [{ label: "All industries", href: "/industries" }, ...menuChildren("industries")],
    },
    { title: "Company", links: company },
    {
      title: "Legal",
      links: legalPages.filter(isVisible).map((p) => ({ label: p.title, href: `/${p.slug}` })),
    },
  ].filter((group) => group.links.length > 0);

  return { primary, cta: consultationCta, footer };
}

import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FloatingDockMount } from "./FloatingDockMount";

const NAVIGATION_QUERY =
  defineQuery(`*[_type == "navigation" && !(title in ["Achievements", "Testimonials"])] | order(order asc){
  title,
  href,
  icon,
  isExternal
}`);

// Href overrides for nav items whose Sanity entry has an empty href.
// Keyed by the nav item title (case-insensitive).
const HREF_OVERRIDES: Record<string, string> = {
  blog: "https://madhudadi.in/blog",
};

export async function FloatingDock() {
  const { data: navItems } = await sanityFetch({ query: NAVIGATION_QUERY });

  if (!navItems || navItems.length === 0) {
    return null;
  }

  // Patch any items that have no href, a bare "#", or a fragment-only href
  // like "#blog" that doesn't point to a real page.
  type NavItem = (typeof navItems)[number];
  const needsOverride = (href: string | null | undefined) => {
    if (!href || !href.trim()) return true;
    const trimmed = href.trim();
    // Fragment-only href: "#" or "#something" with no path
    return trimmed === "#" || /^#[^/]/.test(trimmed);
  };
  const patchedNavItems = navItems.map((item: NavItem) => {
    if (!needsOverride(item.href)) return item;
    const override = item.title
      ? HREF_OVERRIDES[item.title.toLowerCase()]
      : undefined;
    if (!override) return item;
    return { ...item, href: override, isExternal: true };
  });

  return <FloatingDockMount navItems={patchedNavItems} />;
}

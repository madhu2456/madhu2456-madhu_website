import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { FloatingDockMount } from "./FloatingDockMount";

const NAVIGATION_QUERY =
  defineQuery(`*[_type == "navigation" && !(title in ["Achievements", "Testimonials"])] | order(order asc){
  title,
  href,
  icon,
  isExternal
}`);

export async function FloatingDock() {
  const { data: navItems } = await sanityFetch({ query: NAVIGATION_QUERY });

  if (!navItems || navItems.length === 0) {
    return null;
  }

  return <FloatingDockMount navItems={navItems} />;
}

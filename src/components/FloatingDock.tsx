import { getPortfolioData } from "@/lib/portfolio-data";
import { FloatingDockMount } from "./FloatingDockMount";

export async function FloatingDock() {
  const { sortedNavigationItems } = await getPortfolioData();
  const navItems = sortedNavigationItems;

  if (!navItems || navItems.length === 0) {
    return null;
  }

  return <FloatingDockMount navItems={navItems} />;
}

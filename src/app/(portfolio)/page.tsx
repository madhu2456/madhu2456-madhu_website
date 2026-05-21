import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

export default async function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}

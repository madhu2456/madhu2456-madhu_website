import PortfolioContent from "@/components/PortfolioContent";
import { SeoStructuredData } from "@/components/SeoStructuredData";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <SeoStructuredData />
      <PortfolioContent />
    </main>
  );
}

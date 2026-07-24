import { revalidatePath } from "next/cache";

export const revalidatePortfolioRoutes = () => {
  revalidatePath("/", "layout");
  revalidatePath("/case-studies/");
  revalidatePath("/case-studies/[slug]/", "page");
  revalidatePath("/services/");
  revalidatePath("/services/[slug]/", "page");
  revalidatePath("/guides/");
  revalidatePath("/guides/[slug]/", "page");
  revalidatePath("/profile/");
  revalidatePath("/contact/");
  revalidatePath("/credentials/");
  revalidatePath("/privacy/");
  revalidatePath("/ai-consultant-india/");
  revalidatePath("/opengraph-image");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/ai-profile.json");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-portfolio.xml");
};

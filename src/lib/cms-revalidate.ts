import { revalidatePath } from "next/cache";

export const revalidatePortfolioRoutes = () => {
  revalidatePath("/", "layout");
  revalidatePath("/case-studies");
  revalidatePath("/case-studies/[slug]", "page");
  revalidatePath("/opengraph-image");
  revalidatePath("/llms.txt");
  revalidatePath("/ai-profile.json");
  revalidatePath("/sitemap.xml");
};

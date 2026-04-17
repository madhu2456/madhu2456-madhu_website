import { getPortfolioData } from "@/lib/portfolio-data";

export async function AboutSection() {
  const { profile } = await getPortfolioData();

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground">Get to know me better</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {profile.fullBioParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-muted-foreground leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {profile.stats && profile.stats.length > 0 && (
          <div className="@container mt-12 pt-12 border-t">
            <div className="grid grid-cols-2 @lg:grid-cols-4 gap-6">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="@container/stat text-center">
                  <div className="text-3xl @md/stat:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs @md/stat:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

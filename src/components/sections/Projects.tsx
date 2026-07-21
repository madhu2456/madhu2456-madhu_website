import { IconArrowRight, IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { FormattedText } from "@/components/FormattedText";
import { Section } from "@/components/Section";
import { pushToDataLayer } from "@/lib/gtm";
import {
  normalizeImageSource,
  shouldUseUnoptimizedImage,
} from "@/lib/image-source";
import type { ProjectItem } from "@/lib/portfolio-data";
import { getDistinctProjectTagline } from "@/lib/project-display";

export function Projects({ projects }: { projects: ProjectItem[] }) {
  if (projects.length === 0) return null;

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Case studies: AI, RAG & full-stack engineering"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const stack = project.technologies?.map((tech) => tech.name) ?? [];
          const tagline = getDistinctProjectTagline(
            project.title,
            project.tagline,
          );

          return (
            <article
              key={project.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 transition-all hover:-translate-y-1 hover:border-primary/40 shadow-card"
            >
              {project.coverImage &&
              normalizeImageSource(project.coverImage) ? (
                <div className="relative aspect-video w-full overflow-hidden border-b border-border/80 bg-surface">
                  <Image
                    src={normalizeImageSource(project.coverImage) || ""}
                    alt={project.coverImageAlt || project.title}
                    width={800}
                    height={450}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.04]"
                    unoptimized={shouldUseUnoptimizedImage(project.coverImage)}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {project.category ? (
                  <p className="text-[11px] tracking-widest text-primary uppercase sm:text-xs">
                    {project.category}
                  </p>
                ) : null}
                <h3 className="mt-2 min-h-15 font-display text-xl font-semibold leading-tight sm:text-2xl">
                  {project.title}
                </h3>
                {tagline ? (
                  <p className="mt-2 text-sm font-medium text-foreground/80">
                    <FormattedText text={tagline} />
                  </p>
                ) : null}
                {project.impactSummary ? (
                  <p className="mt-3 min-h-36 text-sm leading-relaxed text-muted-foreground">
                    <FormattedText text={project.impactSummary} />
                  </p>
                ) : null}
                <div className="mt-4 flex min-h-14 flex-wrap content-start gap-1.5">
                  {stack.slice(0, 8).map((tech) => (
                    <span
                      key={`${project.slug}-${tech}`}
                      className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <Link
                    href={`/case-studies/${project.slug}/`}
                    prefetch={false}
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition-colors hover:underline"
                  >
                    Read case study <IconArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        pushToDataLayer({
                          event: "outbound_click",
                          outbound_url: project.liveUrl,
                          project_name: project.title,
                          click_location: "case_study_card",
                        })
                      }
                      className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Live <IconExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        pushToDataLayer({
                          event: "outbound_click",
                          outbound_url: project.githubUrl,
                          project_name: project.title,
                          click_location: "case_study_card",
                        })
                      }
                      className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      GitHub <IconExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

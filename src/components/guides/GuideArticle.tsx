import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";

interface GuideArticleProps {
  content: string;
}

export function GuideArticle({ content }: GuideArticleProps) {
  return (
    <article className="max-w-[70ch] mx-auto text-base/relaxed text-foreground/90 pb-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ id, children }) => {
            return (
              <h2
                id={id}
                className="mt-12 mb-6 text-2xl font-bold tracking-tight text-foreground scroll-m-24"
              >
                {children}
              </h2>
            );
          },
          h3: ({ id, children }) => {
            return (
              <h3
                id={id}
                className="mt-8 mb-4 text-xl font-semibold tracking-tight text-foreground scroll-m-24"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="mb-6 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-disc pl-6 space-y-2 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal pl-6 space-y-2 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            const isInternal = href.startsWith("/") || href.startsWith("#");
            if (isInternal) {
              return (
                <Link
                  href={href}
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-primary/30 bg-muted/30 pl-4 py-2 italic text-muted-foreground rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !className;
            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-6 overflow-hidden rounded-xl border bg-muted/50">
                <div className="flex items-center px-4 py-2 border-b bg-muted/80 text-xs font-mono text-muted-foreground">
                  {match?.[1] || "code"}
                </div>
                <pre className="overflow-x-auto p-4 text-sm font-mono text-foreground">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-8 w-full overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-muted py-3 px-4 font-semibold text-foreground bg-muted/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-muted py-3 px-4 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

// AUDIT DECISION QA-F-48B (2026-07-19): Owner chose to KEEP the lightweight
// bold-only parser. Intentionally NOT migrating to react-markdown +
// rehype-sanitize. Rationale: zero XSS surface, 0 KB deps, 27 lines, fast;
// richer formatting in case studies already handled via separate semantic
// sections (splitIntoList) rather than inline Markdown. Do NOT re-flag this
// as an upgrade opportunity in future audits.
//
// Lightweight bold parser — intentionally NOT full Markdown pipeline (no react-markdown/remark/rehype).
// Safe: no dangerouslySetInnerHTML, no innerHTML, no eval, no rehypeRaw — avoids XSS via Markdown.
// Supports **bold** and *italic* (rendered as bold) via split regex — see README tech stack note.
// For case studies, richer content uses separate semantic sections (Problem, Approach, Architecture etc) via splitIntoList.
// If richer Markdown needed, use react-markdown + rehype-sanitize strict allowlist + XSS tests (QA-F-48B opportunity).
// Per 01-standards-manifest + fact registry P-01 Expected Stack Verify Do Not Assume + QA-F-48A strength.
export const FormattedText = ({ text }: { text?: string | null }) => {
  if (!text) return null;
  const parts = text.split(/(?:\*\*|\*)(.*?)(?:\*\*|\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            // biome-ignore lint/suspicious/noArrayIndexKey: Safe to use index for static string array mapping
            key={`${part}-${i}`}
            className="font-semibold text-foreground"
          >
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
};

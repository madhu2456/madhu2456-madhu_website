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

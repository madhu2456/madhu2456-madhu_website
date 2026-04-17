/**
 * Renders an email address in a way that defeats most regex-based scrapers.
 *
 * Technique: the email is reversed before being placed in the DOM.
 * CSS `direction: rtl; unicode-bidi: bidi-override` causes the browser to
 * paint the characters right-to-left, so the reversed string appears as the
 * correct address to human readers while confusing scraper patterns.
 */
export function ObfuscatedEmail({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const reversed = email.split("").reverse().join("");

  return (
    <span className={className}>
      <span className="sr-only">{email}</span>
      <span
        style={{ unicodeBidi: "bidi-override", direction: "rtl" }}
        aria-hidden
      >
        {reversed}
      </span>
    </span>
  );
}

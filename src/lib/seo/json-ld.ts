const ESCAPED_JSON_LD_CHARACTERS: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

/**
 * Safely serialize JSON-LD for inline `<script type="application/ld+json">`.
 *
 * JSON-LD values can include CMS-controlled text. Escaping HTML-sensitive
 * characters prevents strings such as `</script>` from terminating the script
 * tag while preserving valid JSON for crawlers and answer engines.
 */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) => ESCAPED_JSON_LD_CHARACTERS[character] ?? character,
  );
}

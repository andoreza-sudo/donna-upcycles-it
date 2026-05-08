/**
 * Escape characters that have meaning in HTML so untrusted text can be
 * safely interpolated into HTML email bodies, page content, etc.
 */
export function escapeHtml(input: unknown): string {
  if (input == null) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Convert text into a JSON-LD payload that is safe to embed inside an
 * inline <script type="application/ld+json"> tag.
 *
 * JSON.stringify does NOT escape "</" — without this, an attacker who
 * controls any string field (e.g. a Sanity product description) could
 * inject </script><script>...</script> and break out of the JSON block.
 * We replace the offending characters with their JSON unicode escape
 * forms which are still valid JSON.
 */
const JSON_LD_UNSAFE = new RegExp("[<>&\\u2028\\u2029]", "g");

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(JSON_LD_UNSAFE, (c) => {
    const code = c.charCodeAt(0);
    return "\\u" + code.toString(16).padStart(4, "0");
  });
}

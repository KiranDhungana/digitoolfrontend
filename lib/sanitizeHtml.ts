import DOMPurify from "isomorphic-dompurify";

const SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "span",
    "mark",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
  ALLOWED_STYLES: {
    "*": {
      color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/],
      "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/],
      "font-family": [/^[a-zA-Z0-9\s,'"-]+$/],
      "font-size": [/^\d+(?:\.\d+)?(?:px|em|rem|%)$/],
      "line-height": [/^\d+(?:\.\d+)?(?:px|em|rem|%)?$/],
      "text-align": [/^(?:left|right|center|justify)$/],
      "text-decoration": [/^(?:underline|line-through)$/],
    },
  },
};

/** Sanitize for display/save security only — does not alter layout or spacing. */
export function sanitizeProductHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
}

/** Remove empty paragraphs the editor inserts between lines. */
export function compactDescriptionHtml(html: string): string {
  return html
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/(<\/p>)\s*(<p>)/gi, "$1$2");
}

export function isHtmlDescription(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /<\/?[a-z][\s\S]*>/i.test(trimmed);
}

/** Convert legacy plain-text descriptions for the rich editor. */
export function plainTextToEditorHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "<p></p>";
  if (isHtmlDescription(trimmed)) return trimmed;

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => {
      const escaped = block
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const withBreaks = escaped.replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .join("");
}

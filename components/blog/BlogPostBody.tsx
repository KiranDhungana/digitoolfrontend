import { compactDescriptionHtml } from "@/lib/sanitizeHtml";

export function BlogPostBody({ html }: { html: string }) {
  const safe = compactDescriptionHtml(html);
  return (
    <article
      className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-orange-600 prose-img:rounded-xl"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

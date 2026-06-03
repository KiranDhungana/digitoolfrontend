import type { BlogFaqItem } from "@/lib/types/blog";

export function BlogFaqSection({ faq }: { faq: BlogFaqItem[] }) {
  if (!faq.length) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
      <dl className="mt-6 space-y-6">
        {faq.map((item, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <dt className="font-semibold text-gray-900">{item.question}</dt>
            <dd className="mt-2 text-gray-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

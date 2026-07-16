import type { BlogFaqItem } from "@/lib/blog/types";

export function BlogFaqSection({ faq, title = "Frequently asked questions" }: { faq: BlogFaqItem[]; title?: string }) {
  if (faq.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="blog-faq-heading">
      <h2 id="blog-faq-heading" className="text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <dl className="mt-6 space-y-6">
        {faq.map((item) => (
          <div key={item.q}>
            <dt className="font-medium text-slate-900">{item.q}</dt>
            <dd className="mt-2 text-slate-600">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

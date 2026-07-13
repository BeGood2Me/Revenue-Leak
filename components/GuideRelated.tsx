import Link from "next/link";
import type { Guide } from "@/lib/guides";
import { getGuide } from "@/lib/guides";

interface GuideRelatedProps {
  slugs: string[];
  currentSlug: string;
}

export function GuideRelated({ slugs, currentSlug }: GuideRelatedProps) {
  const related = slugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getGuide(slug))
    .filter((g): g is Guide => Boolean(g));

  if (related.length === 0) return null;

  return (
    <aside className="!mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Related guides</h2>
      <ul className="mt-4 space-y-3">
        {related.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="font-medium text-brand-600 hover:underline"
            >
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

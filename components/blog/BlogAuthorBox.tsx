import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { blogAuthor } from "@/lib/blog";

interface BlogAuthorBoxProps {
  variant?: "compact" | "full";
}

export function BlogAuthorBox({ variant = "compact" }: BlogAuthorBoxProps) {
  return (
    <aside
      className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
      aria-label={blogAuthor.name}
    >
      <div className="flex items-center gap-3">
        <BrandMark className="h-9 w-9 shrink-0" />
        <p className="text-lg font-semibold text-slate-900">{blogAuthor.name}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{blogAuthor.bio}</p>

      {variant === "full" ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          {blogAuthor.credentials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {blogAuthor.credentials.slice(0, 2).map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-brand-600" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-sm">
        <Link href="/about" className="font-medium text-brand-600 hover:underline">
          About Revenue Leak →
        </Link>
      </p>
    </aside>
  );
}

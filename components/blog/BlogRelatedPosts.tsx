import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

export function BlogRelatedPosts({ posts, pillarTitle }: { posts: BlogPost[]; pillarTitle?: string }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-xl font-semibold text-slate-900">
        {pillarTitle ? `More in ${pillarTitle}` : "Related articles"}
      </h2>
      <ul className="mt-6 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
            >
              <span className="font-medium text-slate-900 group-hover:text-brand-700">
                {post.title}
              </span>
              <span className="mt-1 block text-sm text-slate-600">{post.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import Link from "next/link";
import type { BlogBlock } from "@/lib/blog/types";
import { BlogInlineText } from "./BlogInlineText";

export function BlogBlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i}>
                <BlogInlineText text={block.text} />
              </p>
            );
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "h3":
            return <h3 key={i}>{block.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <BlogInlineText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <BlogInlineText text={item} />
                  </li>
                ))}
              </ol>
            );
          case "cta":
            return (
              <div
                key={i}
                className="my-8 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center"
              >
                <p className="text-lg font-semibold text-slate-900">{block.headline}</p>
                {block.subline ? (
                  <p className="mt-2 text-sm text-slate-600">{block.subline}</p>
                ) : null}
                <Link
                  href={block.href ?? "/?fresh=1#start"}
                  className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Start free diagnostic
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

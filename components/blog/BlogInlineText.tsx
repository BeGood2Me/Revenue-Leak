import Link from "next/link";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders plain text with optional markdown-style [label](href) links. */
export function BlogInlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const [, label, href] = match;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      parts.push(
        <Link key={key++} href={href} className="text-brand-600 hover:underline">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a key={key++} href={href} className="text-brand-600 hover:underline" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return <>{parts}</>;
}

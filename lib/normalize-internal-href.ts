/**
 * Normalize blog/guide paths so relative mistakes like `blog/foo` on /blog/foo
 * never become /blog/blog/foo in the browser.
 */
export function normalizeInternalHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("//")) return trimmed;

  if (trimmed.startsWith("/")) {
    return collapseDuplicateBlogPrefix(trimmed);
  }

  if (
    trimmed.startsWith("blog/") ||
    trimmed.startsWith("guides/") ||
    trimmed.startsWith("for/")
  ) {
    return collapseDuplicateBlogPrefix(`/${trimmed}`);
  }

  return trimmed;
}

/** `/blog/blog/post` → `/blog/post` */
export function collapseDuplicateBlogPrefix(pathname: string): string {
  return pathname.replace(/^(\/blog)(?:\/blog)+/, "$1");
}

import { blogManifest } from "./manifest";
import type { BlogPillar, BlogPost } from "./types";

export { blogManifest };
export type { BlogAuthor, BlogBlock, BlogFaqItem, BlogManifest, BlogPillar, BlogPost } from "./types";

export const blogAuthor = blogManifest.author;
export const blogPillars = blogManifest.pillars;
export const blogPosts = blogManifest.posts;

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPillar(slug: string): BlogPillar | undefined {
  return blogPillars.find((p) => p.slug === slug);
}

export function getPostsForPillar(pillarSlug: string): BlogPost[] {
  const pillar = getBlogPillar(pillarSlug);
  if (!pillar) return [];
  return pillar.postSlugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => Boolean(p));
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => Boolean(p));
}

export function getPillarForPost(post: BlogPost): BlogPillar | undefined {
  return getBlogPillar(post.pillar);
}

export interface BlogAuthorMethodology {
  title: string;
  text: string;
}

export interface BlogAuthor {
  name: string;
  tagline: string;
  bio: string;
  credentials: string[];
  methodology: BlogAuthorMethodology[];
  disclaimer: string;
  sameAs: string[];
}

export interface BlogFaqItem {
  q: string;
  a: string;
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "cta"; headline: string; subline?: string; href?: string };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
  pillar: string;
  keywords: string[];
  relatedSlugs: string[];
  faq: BlogFaqItem[];
  blocks: BlogBlock[];
}

export interface BlogPillar {
  slug: string;
  title: string;
  description: string;
  published: string;
  postSlugs: string[];
  keywords: string[];
  faq: BlogFaqItem[];
  intro: string;
}

export interface BlogManifest {
  author: BlogAuthor;
  pillars: BlogPillar[];
  posts: BlogPost[];
  generatedAt: string;
}

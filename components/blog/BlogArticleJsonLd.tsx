import { blogAuthor } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog/types";
import { absoluteImageUrl, SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/site-images";
import { getSiteUrl } from "@/lib/site";

export function BlogArticleJsonLd({
  post,
  canonicalPath,
}: {
  post: BlogPost;
  canonicalPath?: string;
}) {
  const base = getSiteUrl();
  const url = `${base}${canonicalPath ?? `/blog/${post.slug}`}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: {
      "@type": "Organization",
      name: blogAuthor.name,
      url: `${base}/about`,
      description: blogAuthor.bio,
      sameAs: blogAuthor.sameAs,
    },
    publisher: {
      "@type": "Organization",
      name: "Revenue Leak",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: absoluteImageUrl(base, SITE_LOGO_PATH),
        caption: SITE_LOGO_ALT,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.keywords.join(", "),
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

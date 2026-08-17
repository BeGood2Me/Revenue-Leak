import { absoluteImageUrl, SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/site-images";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import type { Guide } from "@/lib/guides";

export function ArticleJsonLd({ guide }: { guide: Guide }) {
  const base = getSiteUrl();
  const url = `${base}/guides/${guide.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated ?? guide.published,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${base}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
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
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

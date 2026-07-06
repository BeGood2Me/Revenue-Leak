import { getSiteUrl } from "@/lib/site";
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
    dateModified: guide.published,
    author: {
      "@type": "Organization",
      name: "Revenue Leak",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "Revenue Leak",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: `${base}/icon.svg`,
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

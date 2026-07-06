import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/sample-report`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...guides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      lastModified: new Date(guide.published),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

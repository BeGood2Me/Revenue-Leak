import type { MetadataRoute } from "next";
import { blogPillars, blogPosts } from "@/lib/blog";
import { getGuide, guides } from "@/lib/guides";
import { nicheLandings } from "@/lib/niche-landings";
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
      url: `${base}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/guides`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    ...blogPillars.map((pillar) => ({
      url: `${base}/blog/pillar/${pillar.slug}`,
      lastModified: new Date(pillar.published),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.published),
      changeFrequency: "monthly" as const,
      priority: getGuide(post.slug) ? 0.4 : 0.8,
    })),
    ...guides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      lastModified: new Date(guide.updated ?? guide.published),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...nicheLandings.map((landing) => ({
      url: `${base}/for/${landing.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}

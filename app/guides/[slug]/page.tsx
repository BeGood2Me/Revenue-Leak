import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { BlogFaqJsonLd } from "@/components/blog/BlogFaqJsonLd";
import { GuidePage } from "@/components/GuidePage";
import { guideContentBySlug } from "@/components/guide-content";
import { getGuide, guides } from "@/lib/guides";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  const url = `${getSiteUrl()}/guides/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated ?? guide.published,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const Content = guideContentBySlug[slug];

  if (!guide || !Content) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd guide={guide} />
      {guide.faq?.length ? <BlogFaqJsonLd faq={guide.faq} /> : null}
      <GuidePage guide={guide}>
        <Content />
      </GuidePage>
    </>
  );
}

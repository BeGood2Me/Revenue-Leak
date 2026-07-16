import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleJsonLd } from "@/components/blog/BlogArticleJsonLd";
import { BlogBlockRenderer } from "@/components/blog/BlogBlockRenderer";
import { BlogFaqJsonLd } from "@/components/blog/BlogFaqJsonLd";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import {
  blogPosts,
  getBlogPost,
  getPillarForPost,
  getRelatedPosts,
} from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `${getSiteUrl()}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const pillar = getPillarForPost(post);
  const related = getRelatedPosts(post);

  return (
    <>
      <BlogArticleJsonLd post={post} />
      <BlogFaqJsonLd faq={post.faq} />
      <BlogPostLayout post={post} pillar={pillar}>
        <BlogBlockRenderer blocks={post.blocks} />
        <BlogFaqSection faq={post.faq} />
        <BlogRelatedPosts posts={related} pillarTitle={pillar?.title} />
      </BlogPostLayout>
    </>
  );
}

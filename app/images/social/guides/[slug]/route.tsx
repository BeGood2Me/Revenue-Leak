import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import { GuideOgContent, OG_IMAGE_SIZE } from "@/lib/site-images";

export const runtime = "edge";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return new ImageResponse(
    <GuideOgContent title={guide.title} description={guide.description} />,
    {
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
    }
  );
}

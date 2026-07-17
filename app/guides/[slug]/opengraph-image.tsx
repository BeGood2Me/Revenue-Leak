import { ImageResponse } from "next/og";
import { getGuide, guides } from "@/lib/guides";

export const alt = "Revenue Leak guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideOpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const title = guide?.title ?? "Revenue Leak Guide";
  const description =
    guide?.description ?? "Practical guides on finding and fixing revenue leaks.";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "linear-gradient(145deg, #0d9488 0%, #134e4a 55%, #12161c 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, opacity: 0.9 }}>
          Revenue Leak · Guide
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.4,
            opacity: 0.92,
            maxWidth: 900,
          }}
        >
          {description.length > 140 ? `${description.slice(0, 137)}...` : description}
        </div>
      </div>
    ),
    { ...size }
  );
}

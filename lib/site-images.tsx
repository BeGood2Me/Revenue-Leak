import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** SEO-friendly public image paths (keyword-rich filenames). */
export const SITE_LOGO_PATH = "/images/revenue-leak-logo.svg";
export const SITE_LOGO_ALT = "Revenue Leak logo — teal funnel with copper revenue drip";

export const SITE_OG_HOME_PATH = "/images/social/revenue-leak-diagnostic-preview";
export const SITE_OG_HOME_ALT =
  "Revenue Leak diagnostic — find where your business is losing revenue";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export function guideSocialPreviewPath(slug: string): string {
  return `/images/social/guides/${slug}`;
}

export function guideSocialPreviewAlt(title: string): string {
  return `${title} — Revenue Leak guide`;
}

export function absoluteImageUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function homeOpenGraphImages() {
  return [
    {
      url: SITE_OG_HOME_PATH,
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
      alt: SITE_OG_HOME_ALT,
    },
  ];
}

export function guideOpenGraphImages(guide: { slug: string; title: string }) {
  return [
    {
      url: guideSocialPreviewPath(guide.slug),
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
      alt: guideSocialPreviewAlt(guide.title),
    },
  ];
}

/** Shared OG card styles for ImageResponse templates. */
export const OG_GRADIENT = "linear-gradient(145deg, #0d9488 0%, #134e4a 55%, #12161c 100%)";

export function HomeOgContent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "72px",
        background: OG_GRADIENT,
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        {SITE_NAME}
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          maxWidth: 900,
        }}
      >
        Find where your business is losing revenue
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          lineHeight: 1.4,
          opacity: 0.92,
          maxWidth: 820,
        }}
      >
        {SITE_DESCRIPTION}
      </div>
    </div>
  );
}

export function GuideOgContent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const summary =
    description.length > 140 ? `${description.slice(0, 137)}...` : description;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "72px",
        background: OG_GRADIENT,
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
        {summary}
      </div>
    </div>
  );
}

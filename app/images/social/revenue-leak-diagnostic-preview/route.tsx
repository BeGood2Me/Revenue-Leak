import { ImageResponse } from "next/og";
import { HomeOgContent, OG_IMAGE_SIZE } from "@/lib/site-images";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(<HomeOgContent />, {
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
  });
}

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Parent folder has a package-lock.json; pin tracing to this app root.
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/for/agency",
        destination: "/for/agencies",
        permanent: true,
      },
      // Guard against accidental double /blog prefix (relative-link mistakes, typed URLs).
      {
        source: "/blog/blog/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
      // Legacy generic image URLs → keyword-rich paths
      {
        source: "/icon.svg",
        destination: "/images/revenue-leak-logo.svg",
        permanent: true,
      },
      {
        source: "/opengraph-image",
        destination: "/images/social/revenue-leak-diagnostic-preview",
        permanent: true,
      },
      {
        source: "/guides/:slug/opengraph-image",
        destination: "/images/social/guides/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/result/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

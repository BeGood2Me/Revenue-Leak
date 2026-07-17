import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Parent folder has a package-lock.json; pin tracing to this app root.
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
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

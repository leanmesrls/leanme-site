import type { NextConfig } from "next";

// Build locale (`npm run build`) usa `.next-prod` per non corrompere la cache dev.
// Su Vercel resta sempre `.next` (output atteso dalla piattaforma).
const useLocalProdDistDir =
  process.env.LEANME_PROD_BUILD === "1" && process.env.VERCEL !== "1";

const nextConfig: NextConfig = {
  distDir: useLocalProdDistDir ? ".next-prod" : ".next",
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

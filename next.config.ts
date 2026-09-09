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
  async redirects() {
    return [
      {
        source: "/segreteria",
        destination: "/vcards",
        permanent: true,
      },
      {
        source: "/segreteria/vcard/:slug",
        destination: "/vcards/vcard/:slug",
        permanent: true,
      },
      {
        source: "/segreteria/:slug",
        destination: "/vcards/:slug",
        permanent: true,
      },
      // 301 dal WordPress leanme.it. `/lean-academy` è già identico, nessun redirect.
      {
        source: "/contattaci_digital_agency_bologna",
        destination: "/contatti",
        permanent: true,
      },
      {
        source: "/comunicazione-e-web-marketing-a-bologna",
        destination: "/come-possiamo-aiutarti/comunicare-meglio",
        permanent: true,
      },
      {
        source: "/eventi_formazione_bologna",
        destination: "/come-possiamo-aiutarti/partner-eventi",
        permanent: true,
      },
      {
        source: "/servizi_it_bologna",
        destination: "/come-possiamo-aiutarti",
        permanent: true,
      },
      {
        source: "/sviluppo_web_bologna",
        destination: "/come-possiamo-aiutarti",
        permanent: true,
      },
      {
        source: "/idea_lean_bologna",
        destination: "/chi-siamo",
        permanent: true,
      },
      {
        source: "/notizie_dal_web",
        destination: "/leanlab",
        permanent: true,
      },
      {
        source: "/cart-2",
        destination: "/contatti",
        permanent: true,
      },
      {
        source: "/checkout-2",
        destination: "/contatti",
        permanent: true,
      },
      {
        source: "/bacheca",
        destination: "/",
        permanent: true,
      },
    ];
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

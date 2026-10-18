import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/lean-human",
        "/api/teresa",
        "/wp-admin",
        "/wp-includes",
        "/wp-content",
        "/wp-json",
        "/xmlrpc.php",
        "/wp-login.php",
        "/*.php$",
        "/.env",
        "/@fs/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import { SITE_URL } from "@/lib/metadata";
import siteData from "@/data/site.json";
import type { SiteConfig } from "@/types/content";

const site = siteData as SiteConfig;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company,
    url: SITE_URL,
    logo: `${SITE_URL}/images/placeholders/logo.svg`,
    description: site.seo.defaultDescription,
    slogan: site.claim,
    sameAs: site.footer.social.map((s) => s.href),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Italian"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: SITE_URL,
    description: site.seo.defaultDescription,
    inLanguage: site.language,
    publisher: {
      "@type": "Organization",
      name: site.company,
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  author: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    image: article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`,
    publisher: {
      "@type": "Organization",
      name: site.company,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/placeholders/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${article.path}`,
    },
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: site.company,
    },
    url: `${SITE_URL}${service.path}`,
  };
}

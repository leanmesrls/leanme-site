import siteData from "@/data/site.json";
import homepageData from "@/data/homepage.json";
import percorsiData from "@/data/percorsi.json";
import chiSiamoData from "@/data/chi-siamo.json";
import staffData from "@/data/staff.json";
import leanLabCategories from "@/data/leanlab/categories.json";
import leanLabArticles from "@/data/leanlab/articles.json";
import testimonialsData from "@/data/testimonials.json";
import academyData from "@/data/academy.json";
import contattiData from "@/data/contatti.json";

import type {
  AcademyData,
  ChiSiamoData,
  ContactData,
  HomepageData,
  LeanLabArticle,
  LeanLabCategory,
  Percorso,
  SiteConfig,
  StaffData,
  Testimonial,
} from "@/types/content";

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig;
}

export function getHomepageData(): HomepageData {
  return homepageData as HomepageData;
}

export function getPercorsiData(): {
  intro: { id: string; title: string; subtitle?: string; description?: string };
  percorsi: Percorso[];
} {
  return percorsiData as {
    intro: { id: string; title: string; subtitle?: string; description?: string };
    percorsi: Percorso[];
  };
}

export function getPercorsoBySlug(slug: string): Percorso | undefined {
  return getPercorsiData().percorsi.find((p) => p.slug === slug);
}

export function getChiSiamoData(): ChiSiamoData {
  return chiSiamoData as ChiSiamoData;
}

export function getStaffData(): StaffData {
  return staffData as StaffData;
}

export function getLeanAgentBySlug(slug: string) {
  return getStaffData().leanAgents.find((a) => a.slug === slug);
}

export function getLeanLabCategories(): LeanLabCategory[] {
  return leanLabCategories as LeanLabCategory[];
}

export function getLeanLabArticles(): LeanLabArticle[] {
  return leanLabArticles as LeanLabArticle[];
}

export function getLeanLabArticlesByCategory(categorySlug: string): LeanLabArticle[] {
  return getLeanLabArticles().filter((a) => a.category === categorySlug);
}

export function getLeanLabArticle(slug: string): LeanLabArticle | undefined {
  return getLeanLabArticles().find((a) => a.slug === slug);
}

export function getLeanLabCategory(slug: string): LeanLabCategory | undefined {
  return getLeanLabCategories().find((c) => c.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

export function getAcademyData(): AcademyData {
  return academyData as AcademyData;
}

export function getContattiData(): ContactData {
  return contattiData as ContactData;
}

export function getAllPercorsoSlugs(): string[] {
  return getPercorsiData().percorsi.map((p) => p.slug);
}

export function getAllLeanAgentSlugs(): string[] {
  return getStaffData().leanAgents.map((a) => a.slug);
}

export function getAllLeanLabCategorySlugs(): string[] {
  return getLeanLabCategories().map((c) => c.slug);
}

export function getAllLeanLabArticleSlugs(): string[] {
  return getLeanLabArticles().map((a) => a.slug);
}

export function getAllAcademyResourceSlugs(): string[] {
  return getAcademyData().publicArea.resources.map((r) => r.slug);
}

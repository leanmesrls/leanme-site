import {
  getAcademyData,
  getLeanLabArticle,
  getListedLeanLabArticles,
  getPublishedAcademyResources,
} from "@/lib/content";
import type {
  AcademyResource,
  LeanLabArticle,
  LeanLabArticleCta,
} from "@/types/content";

export interface LeanLabAsideAction {
  href: string;
  label: string;
}

export interface LeanLabAsideRelated {
  href: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  kicker?: string;
}

export interface LeanLabArticleAsideModel {
  actions: LeanLabAsideAction[];
  related: LeanLabAsideRelated[];
  relatedFooter?: LeanLabAsideAction;
}

function action(cta: LeanLabArticleCta | undefined): LeanLabAsideAction[] {
  if (!cta?.href || !cta.label) return [];
  return [{ href: cta.href, label: cta.label }];
}

function articleCard(article: LeanLabArticle, kicker?: string): LeanLabAsideRelated {
  return {
    href: `/leanlab/articolo/${article.slug}`,
    title: article.title,
    imageSrc: article.image.src,
    imageAlt: article.image.alt,
    kicker,
  };
}

function academyCard(resource: AcademyResource): LeanLabAsideRelated {
  return {
    href: resource.href,
    title: resource.title,
    imageSrc: resource.image.src,
    imageAlt: resource.image.alt,
    kicker: "Lean Academy",
  };
}

function sameCategoryArticles(article: LeanLabArticle): LeanLabAsideRelated[] {
  return getListedLeanLabArticles()
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => articleCard(item, "Lean Lab"));
}

function linkedAcademy(article: LeanLabArticle): LeanLabAsideRelated[] {
  const explicit = new Set(article.relatedAcademySlugs ?? []);
  const articlePath = `/leanlab/articolo/${article.slug}`;

  return getPublishedAcademyResources()
    .filter(
      (resource) =>
        explicit.has(resource.slug) || resource.articleHref === articlePath
    )
    .map(academyCard);
}

export function buildLeanLabArticleAside(
  article: LeanLabArticle
): LeanLabArticleAsideModel | null {
  const actions = [...action(article.cta), ...action(article.videoCta)];

  if (article.bodyTemplate === "newsletter-ricerca-episodio-01") {
    actions.push({
      href: "/prenota-consulenza",
      label: "Ripensiamo insieme il tuo nuovo sito internet!",
    });
  }

  const seen = new Set<string>();
  const related = [...linkedAcademy(article), ...sameCategoryArticles(article)].filter(
    (item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    }
  );

  if (actions.length === 0 && related.length === 0) return null;

  return { actions, related };
}

export function buildAcademyResourceAside(
  resource: AcademyResource
): LeanLabArticleAsideModel | null {
  const actions: LeanLabAsideAction[] = [];
  const related: LeanLabAsideRelated[] = [];

  if (resource.articleHref) {
    actions.push({
      href: resource.articleHref,
      label: "Leggi nel Lean Lab",
    });
    const slug = resource.articleHref.split("/").pop();
    const article = slug ? getLeanLabArticle(slug) : undefined;
    if (article && article.listed !== false) {
      related.push(articleCard(article, "Lean Lab"));
    }
  }

  for (const other of getPublishedAcademyResources()) {
    if (other.slug === resource.slug) continue;
    related.push(academyCard(other));
  }

  if (actions.length === 0 && related.length === 0) return null;

  return { actions, related };
}

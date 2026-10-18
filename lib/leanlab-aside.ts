import {
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
  category?: string;
  action?: LeanLabAsideAction;
}

export interface LeanLabArticleAsideModel {
  actions: LeanLabAsideAction[];
  related: LeanLabAsideRelated[];
  relatedFooter?: LeanLabAsideAction;
}

function isInterestCta(cta: LeanLabArticleCta | undefined): boolean {
  return /ti interessa questo argomento/i.test(cta?.label ?? "");
}

function pushAction(
  actions: LeanLabAsideAction[],
  href: string | undefined,
  label: string | undefined
) {
  if (!href || !label) return;
  if (actions.some((item) => item.href === href && item.label === label)) return;
  actions.push({ href, label });
}

const categoryKickers: Record<string, string> = {
  "progetti-conclusi": "Progetti",
  "ricerca-e-innovazione": "Ricerca & Innovazione",
  "vita-in-leanme": "Vita in LeanMe",
};

function articleCard(article: LeanLabArticle): LeanLabAsideRelated {
  return {
    href: `/leanlab/articolo/${article.slug}`,
    title: article.title,
    imageSrc: article.image.src,
    imageAlt: article.image.alt,
    kicker: categoryKickers[article.category] ?? "Lean Lab",
    category: article.category,
  };
}

function academyCard(resource: AcademyResource): LeanLabAsideRelated {
  return {
    href: resource.href,
    title: resource.title,
    imageSrc: resource.image.src,
    imageAlt: resource.image.alt,
    kicker: resource.tag ?? "Lean Academy",
    category: resource.tag?.toLowerCase().includes("ricerca")
      ? "ricerca-e-innovazione"
      : undefined,
  };
}

function sameCategoryArticles(article: LeanLabArticle): LeanLabAsideRelated[] {
  return getListedLeanLabArticles()
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => articleCard(item));
}

function resourceCategory(resource: AcademyResource): string | undefined {
  if (resource.articleHref) {
    const slug = resource.articleHref.split("/").filter(Boolean).pop();
    const linked = slug ? getLeanLabArticle(slug) : undefined;
    if (linked?.category) return linked.category;
  }

  const tag = resource.tag?.toLowerCase() ?? "";
  return Object.entries(categoryKickers).find(([, label]) =>
    tag.includes(label.toLowerCase())
  )?.[0];
}

function articleActions(article: LeanLabArticle): LeanLabAsideAction[] {
  const actions: LeanLabAsideAction[] = [];

  pushAction(actions, article.videoCta?.href, article.videoCta?.label);

  if (article.cta?.href === "/prompt-builder") {
    pushAction(actions, "/prompt-builder", "Prompt Builder · versione beta");
  } else if (!isInterestCta(article.cta)) {
    pushAction(actions, article.cta?.href, article.cta?.label);
  }

  if (article.bodyTemplate === "newsletter-ricerca-episodio-01") {
    pushAction(
      actions,
      "/prenota-consulenza",
      "Ripensiamo insieme il tuo nuovo sito internet!"
    );
  }

  return actions;
}

function sameCategoryVideos(article: LeanLabArticle): LeanLabAsideRelated[] {
  const articlePath = `/leanlab/articolo/${article.slug}`;
  const listedHrefs = new Set(
    sameCategoryArticles(article).map((item) => item.href)
  );

  return getPublishedAcademyResources()
    .filter((resource) => resourceCategory(resource) === article.category)
    .filter((resource) => resource.articleHref !== articlePath)
    .filter((resource) => resource.href !== article.videoCta?.href)
    .filter(
      (resource) => !resource.articleHref || !listedHrefs.has(resource.articleHref)
    )
    .map((resource) => academyCard(resource));
}

export function buildLeanLabArticleAside(
  article: LeanLabArticle
): LeanLabArticleAsideModel | null {
  const actions = articleActions(article);
  const currentHref = `/leanlab/articolo/${article.slug}`;
  const seen = new Set<string>([currentHref]);
  const related = [...sameCategoryArticles(article), ...sameCategoryVideos(article)].filter(
    (item) => {
      if (item.href === currentHref || seen.has(item.href)) return false;
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
  const slug = resource.articleHref?.split("/").filter(Boolean).pop();
  const article = slug ? getLeanLabArticle(slug) : undefined;
  const currentArticleHref = article ? `/leanlab/articolo/${article.slug}` : undefined;
  const hidden = new Set<string>([resource.href]);
  if (currentArticleHref) hidden.add(currentArticleHref);

  const actions: LeanLabAsideAction[] = [];
  if (currentArticleHref) {
    pushAction(actions, currentArticleHref, "Leggi l'articolo nel Lean Lab");
  }
  if (article) {
    for (const item of articleActions(article)) {
      if (hidden.has(item.href)) continue;
      pushAction(actions, item.href, item.label);
    }
  }

  const related: LeanLabAsideRelated[] = [];
  const seen = new Set<string>(hidden);
  const fromArticle =
    article && article.listed !== false ? buildLeanLabArticleAside(article)?.related ?? [] : [];
  for (const item of fromArticle) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    related.push(item);
  }

  if (!article) {
    for (const other of getPublishedAcademyResources()) {
      if (other.slug === resource.slug || seen.has(other.href)) continue;
      if (resource.tag && other.tag && other.tag !== resource.tag) continue;
      seen.add(other.href);
      related.push(academyCard(other));
    }
  }

  if (actions.length === 0 && related.length === 0) return null;

  return { actions, related };
}

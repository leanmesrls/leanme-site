import { getListedLeanLabArticles } from "@/lib/content";
import type { LeanLabArticle, LeanLabArticleCta } from "@/types/content";

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

function rebuildSiblings(article: LeanLabArticle): LeanLabAsideRelated[] {
  return getListedLeanLabArticles()
    .filter(
      (item) =>
        item.slug !== article.slug && item.slug.startsWith("leanme-rebuild-")
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => ({
      href: `/leanlab/articolo/${item.slug}`,
      title: item.title,
      imageSrc: item.image.src,
      imageAlt: item.image.alt,
    }));
}

export function buildLeanLabArticleAside(
  article: LeanLabArticle
): LeanLabArticleAsideModel | null {
  const actions = [...action(article.cta), ...action(article.videoCta)];
  let related: LeanLabAsideRelated[] = [];
  let relatedFooter: LeanLabAsideAction | undefined;

  if (article.bodyTemplate === "progetti-san-lazzaro") {
    related = [
      {
        href: "/lean-academy/ricerca-e-innovazione-episodio-01",
        title: "Hai seguito la lezione di Olivetti su SEO, AEO e GEO?",
        imageSrc: "/assets/leanlab/ricerca-episodio-01-cover.jpg",
        imageAlt:
          "Te lo spiego io, episodio 01: SEO, AEO e GEO con Lean.Agent Olivetti.",
        kicker: "Guarda il video in Lean Academy",
      },
    ];
    relatedFooter = {
      href: "/lean-academy",
      label: "Altri video in Lean Academy",
    };
  } else if (article.slug.startsWith("leanme-rebuild-")) {
    related = rebuildSiblings(article);
  } else if (article.bodyTemplate === "newsletter-ricerca-episodio-01") {
    actions.push({
      href: "/prenota-consulenza",
      label: "Ripensiamo insieme il tuo nuovo sito internet!",
    });
  }

  if (actions.length === 0 && related.length === 0) return null;

  return { actions, related, relatedFooter };
}

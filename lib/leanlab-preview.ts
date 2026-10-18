import type { LeanLabArticle, LeanLabArticleCta } from "@/types/content";

const READ_LABEL = "Leggi l'articolo nel Lean Lab";
const WATCH_LABEL = "Guarda la puntata in Lean Academy";

export function leanLabPreviewCtas(article: LeanLabArticle): {
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
} {
  const articleHref = `/leanlab/articolo/${article.slug}`;
  const academy = article.videoCta?.href.startsWith("/lean-academy/")
    ? article.videoCta
    : undefined;

  if (academy) {
    return {
      cta: { href: articleHref, label: READ_LABEL },
      videoCta: { href: academy.href, label: WATCH_LABEL },
    };
  }

  if (article.slug === "poliambulatorio-privato-san-lazzaro") {
    return { cta: { href: articleHref, label: "Leggi l'articolo" } };
  }

  return { cta: article.cta, videoCta: article.videoCta };
}

import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import type { LeanLabArticle } from "@/types/content";

interface ArticleCardProps {
  article: LeanLabArticle;
}

const categoryLabels: Record<string, string> = {
  "progetti-conclusi": "PROGETTO",
  "ricerca-e-innovazione": "RICERCA",
  "vita-in-leanme": "VITA IN LEANME",
  tutorial: "ACADEMY",
};

export function ArticleCard({ article }: ArticleCardProps) {
  const imageSrc = article.image.src.startsWith("/assets/")
    ? article.image.src
    : ASSETS.decorative.bannerAmbient;

  return (
    <Link
      href={`/leanlab/articolo/${article.slug}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition hover:border-leanme-purple/30"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={article.image.alt}
          fill
          className="object-cover opacity-80 transition group-hover:opacity-100"
          sizes="(max-width: 1280px) 33vw, 320px"
        />
      </div>
      <div className="space-y-3 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-purple">
          {categoryLabels[article.category] ?? article.category}
        </span>
        <h3 className="min-h-[3rem] text-sm font-semibold leading-snug text-white">
          {article.title}
        </h3>
        <p className="text-xs text-white/50">{article.readTime} di lettura</p>
      </div>
    </Link>
  );
}

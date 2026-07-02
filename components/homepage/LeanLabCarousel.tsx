"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/homepage/Icons";
import { SectionTitle } from "@/components/homepage/SectionTitle";
import type { LeanLabArticle } from "@/types/content";
import type { HomepageData } from "@/types/homepage";
import { ASSETS } from "@/lib/assets";

interface LeanLabCarouselProps {
  data: HomepageData["leanLab"];
  articles: LeanLabArticle[];
}

const categoryLabels: Record<string, string> = {
  "progetti-conclusi": "PROGETTO",
  "ricerca-e-innovazione": "RICERCA",
  "vita-in-leanme": "VITA IN LEANME",
  tutorial: "ACADEMY",
};

export function LeanLabCarousel({ data, articles }: LeanLabCarouselProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id ?? "progetti");
  const [page, setPage] = useState(0);

  const activeCategory = data.tabs.find((tab) => tab.id === activeTab)?.category;
  const filtered = useMemo(
    () => articles.filter((article) => article.category === activeCategory),
    [articles, activeCategory]
  );

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);

  function selectTab(id: string) {
    setActiveTab(id);
    setPage(0);
  }

  return (
    <section className="bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle align="left" underline={false}>
            {data.title}
          </SectionTitle>
          <Link
            href={data.viewAll.href}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-leanme-purple transition hover:text-white md:mb-2"
          >
            {data.viewAll.label}
            <ArrowIcon />
          </Link>
        </div>

        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-white/10 pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={`shrink-0 border-b-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition md:text-xs ${
                activeTab === tab.id
                  ? "border-leanme-purple text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative mt-10">
          <div className="hidden gap-4 lg:grid lg:grid-cols-4">
            {visible.map((article) => (
              <Link
                key={article.slug}
                href={`/leanlab/articolo/${article.slug}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition hover:border-leanme-purple/30"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={ASSETS.decorative.bannerAmbient}
                    alt={article.title}
                    fill
                    className="object-cover opacity-80 transition group-hover:opacity-100"
                    sizes="(max-width: 1280px) 25vw, 300px"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-purple">
                    {categoryLabels[article.category] ?? "ARTICOLO"}
                  </span>
                  <h3 className="min-h-[3rem] text-sm font-semibold leading-snug text-white">
                    {article.title}
                  </h3>
                  <p className="text-xs text-white/50">{article.readTime} di lettura</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="lg:hidden">
            {visible[0] && (
              <Link
                href={`/leanlab/articolo/${visible[0].slug}`}
                className="block overflow-hidden rounded-xl border border-white/10 bg-[#111111]"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={ASSETS.decorative.bannerAmbient}
                    alt={visible[0].title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-purple">
                    {categoryLabels[visible[0].category] ?? "ARTICOLO"}
                  </span>
                  <h3 className="text-base font-semibold text-white">{visible[0].title}</h3>
                  <p className="text-xs text-white/50">{visible[0].readTime} di lettura</p>
                </div>
              </Link>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Pagina ${index + 1}`}
                onClick={() => setPage(index)}
                className={`h-2 w-2 rounded-full transition ${
                  page === index ? "bg-leanme-purple" : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pointer-events-none absolute inset-y-0 hidden w-full items-center justify-between lg:flex">
              <button
                type="button"
                aria-label="Articoli precedenti"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="pointer-events-auto rounded-full border border-white/20 bg-black/70 px-3 py-2 text-white transition hover:border-leanme-purple"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Articoli successivi"
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                className="pointer-events-auto rounded-full border border-white/20 bg-black/70 px-3 py-2 text-white transition hover:border-leanme-purple"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

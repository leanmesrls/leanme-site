import Link from "next/link";

import {
  ChiSiamoComicFullRow,
  ChiSiamoComicRow,
  COMIC_ROW_LAYOUT,
} from "@/components/chi-siamo/ChiSiamoComicRow";
import { ChiSiamoManifesto } from "@/components/chi-siamo/ChiSiamoManifesto";
import { ChiSiamoTeaser } from "@/components/chi-siamo/ChiSiamoTeaser";
import { ChiSiamoTeamGrid } from "@/components/chi-siamo/ChiSiamoTeamGrid";
import { HighlightCard } from "@/components/layout/HighlightCard";
import { ArrowIcon } from "@/components/homepage/Icons";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { ChiSiamoData } from "@/types/content";

interface ChiSiamoComicPageProps {
  comic: ChiSiamoData["comic"];
  team: ChiSiamoData["team"];
  teaser: ChiSiamoData["teaser"];
  actions: ChiSiamoData["actions"];
  comicIntro: ChiSiamoData["comicIntro"];
  leanThinking: ChiSiamoData["leanThinking"];
  manifesto: ChiSiamoData["manifesto"];
}

export function ChiSiamoComicPage({
  comic,
  team,
  teaser,
  actions,
  comicIntro,
  leanThinking,
  manifesto,
}: ChiSiamoComicPageProps) {
  const [impegno] = comic.row4;

  return (
    <section
      aria-label="Fumetto Chi siamo LeanMe"
      className="bg-black px-5 py-6 md:px-10 md:py-8 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-0">
        <div className="mb-4 md:mb-6">
          <ChiSiamoTeaser teaser={teaser} />
        </div>

        <RevealOnScroll className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mb-10">
          <Link
            href={actions.staff.href}
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-leanme-fuchsia bg-leanme-fuchsia/15 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(233,30,140,0.18)] transition hover:bg-leanme-fuchsia/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            {actions.staff.label}
          </Link>
          <Link
            href={actions.connect.href}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {actions.connect.label}
            <ArrowIcon />
          </Link>
        </RevealOnScroll>

        <RevealOnScroll className="mb-5 md:mb-6">
          <h2 className="text-2xl font-bold tracking-[0.03em] text-white md:text-3xl lg:text-[2rem]">
            {comicIntro.title}
          </h2>
        </RevealOnScroll>

        <ChiSiamoComicRow
          panels={comic.row1}
          columns={COMIC_ROW_LAYOUT.row1.columns}
          aspectRatio={COMIC_ROW_LAYOUT.row1.aspectRatio}
        />

        <div className="mt-5 md:mt-6">
          <ChiSiamoManifesto manifesto={manifesto} compact />
        </div>

        <div className="mt-6 md:mt-8">
          <ChiSiamoTeamGrid team={team} />
        </div>

        <div className="mt-10 md:mt-14">
          <ChiSiamoComicRow
            panels={comic.row3}
            columns={COMIC_ROW_LAYOUT.row3.columns}
            aspectRatio={COMIC_ROW_LAYOUT.row3.aspectRatio}
            sizes="50vw"
          />
        </div>

        <div className="mt-6 md:mt-8">
          <RevealOnScroll>
            <HighlightCard
              id="lean-thinking"
              ariaLabelledBy="chi-siamo-lean-thinking-heading"
            >
              <h2
                id="chi-siamo-lean-thinking-heading"
                className="text-xl font-bold leading-snug tracking-[0.03em] text-leanme-fuchsia md:text-2xl lg:text-[1.65rem]"
              >
                {leanThinking.title}
              </h2>
              <div className="mt-6 space-y-4">
                {leanThinking.content.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-base leading-relaxed text-white/80 md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </HighlightCard>
          </RevealOnScroll>
        </div>

        {impegno ? (
          <div className="mt-6 md:mt-8">
            <ChiSiamoComicFullRow
              panel={impegno}
              aspectRatio={COMIC_ROW_LAYOUT.row4.aspectRatio}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_AFTER_INTRO_CLASS, PAGE_INTRO_SECTION_CLASS } from "@/components/layout/HighlightCard";
import type { AcademyData, AcademyResource } from "@/types/content";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import { getAcademyData, getPublishedAcademyResources, getSeoInPocheParole } from "@/lib/content";
import { categoryBadgeFromLabel } from "@/lib/leanlab-category";
import { ASSETS } from "@/lib/assets";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Lean Academy",
  description:
    "Area pubblica Lean Academy: l'intervista radio 2026 in tre episodi e le puntate di Ricerca e Innovazione. L'area riservata è in arrivo.",
  path: "/lean-academy",
});

function KeyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="14" r="4" />
      <path d="M11.5 11.5 20 3" />
      <path d="M16 7l2 2" />
      <path d="M18 5l2 2" />
    </svg>
  );
}

function SeriesCard({
  series,
  episodes,
}: {
  series: NonNullable<AcademyData["publicArea"]["series"]>[number];
  episodes: AcademyResource[];
}) {
  return (
    <article
      id={series.id}
      aria-labelledby={`${series.id}-heading`}
      className="overflow-hidden rounded-lg border border-white/[0.08] bg-leanme-card"
    >
      {series.image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <Image
            src={series.image.src}
            alt={series.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
      ) : null}
      <div className="space-y-2 p-4">
        <span className={categoryBadgeFromLabel(series.categoryLabel ?? series.title)}>
          {series.categoryLabel ?? series.title}
        </span>
        <h3 id={`${series.id}-heading`} className="text-sm font-semibold leading-snug text-white">
          {series.title}
        </h3>
        <ol className="space-y-1">
          {episodes.map((resource) => (
            <li key={resource.slug}>
              <Link
                href={resource.href}
                className="group flex items-center gap-2 rounded-md py-1.5 text-sm font-semibold leading-snug text-white transition hover:text-leanme-fuchsia focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-leanme-fuchsia">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
                <span>{resource.episodeTitle ?? resource.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function ResourceCard({ resource }: { resource: AcademyResource }) {
  return (
    <article className="overflow-hidden rounded-lg border border-white/[0.08] bg-leanme-card">
      <Link
        href={resource.href}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={resource.image.src}
            alt={resource.image.alt}
            fill
            className="object-cover object-top transition group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
        <div className="space-y-2 p-4">
          {resource.tag ? (
            <span className={categoryBadgeFromLabel(resource.tag)}>{resource.tag}</span>
          ) : null}
          <h3 className="min-h-[2.75rem] text-sm font-semibold leading-snug text-white group-hover:text-leanme-fuchsia">
            {resource.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

export default function LeanAcademyPage() {
  const data = getAcademyData();
  const summary = getSeoInPocheParole("/lean-academy");
  const published = getPublishedAcademyResources();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lean Academy", path: "/lean-academy" },
        ])}
      />
      <PageHero
        id="lean-academy-heading"
        title={data.intro.title}
        subtitle={data.intro.subtitle}
        background={ASSETS.decorative.leanAcademy}
        imageAlt="Lean Academy — monitor didattico"
        variant="lean-academy"
      />
      <PageSection className={PAGE_INTRO_SECTION_CLASS}>
        <PageHighlightBlock paragraphs={data.intro.description} />
      </PageSection>
      <PageSection className={PAGE_CONTENT_AFTER_INTRO_CLASS}>
        <div className="flex justify-end">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
            <KeyIcon />
            {data.reservedArea.title}
            <span className="text-leanme-fuchsia">Coming Soon</span>
          </p>
        </div>

        <RevealOnScroll>
          <h2 className="mt-8 text-lg font-bold uppercase tracking-[0.1em] text-white md:text-xl">
            {data.publicArea.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
            {data.publicArea.description}
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {(data.publicArea.series ?? []).map((series) => {
            const episodes = published.filter((resource) => resource.series === series.id);
            if (episodes.length === 0) return null;

            return (
              <RevealOnScroll key={series.id}>
                <SeriesCard series={series} episodes={episodes} />
              </RevealOnScroll>
            );
          })}
          {published
            .filter((resource) => !resource.series)
            .map((resource) => (
              <RevealOnScroll key={resource.slug}>
                <ResourceCard resource={resource} />
              </RevealOnScroll>
            ))}
        </div>

        {summary.length > 0 ? (
          <div className="mt-16">
            <InPocheParoleBox paragraphs={summary} />
          </div>
        ) : null}
      </PageSection>
    </>
  );
}

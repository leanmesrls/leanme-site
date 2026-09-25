import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_AFTER_INTRO_CLASS, PAGE_INTRO_SECTION_CLASS } from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import { getAcademyData, getPublishedAcademyResources, getSeoInPocheParole } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Lean Academy",
  description:
    "Area pubblica Lean Academy: la prima puntata di Ricerca e Innovazione, Te lo spiego io. L'area riservata è in arrivo.",
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

        <div className="mt-10 space-y-8">
          {published.map((resource) => (
            <RevealOnScroll key={resource.slug}>
              <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]">
                <Link
                  href={resource.href}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
                >
                  <div className="relative aspect-[1024/433] overflow-hidden">
                    <Image
                      src={resource.image.src}
                      alt={resource.image.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1280px) 100vw, 1152px"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    {resource.tag ? (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
                        {resource.tag}
                      </p>
                    ) : null}
                    <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-leanme-fuchsia md:text-2xl">
                      {resource.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
                      {resource.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia">
                      Guarda la puntata →
                    </p>
                  </div>
                </Link>
              </article>
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

import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_AFTER_INTRO_CLASS, PAGE_INTRO_SECTION_CLASS } from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { FuchsiaGlowCard } from "@/components/motion/FuchsiaGlowCard";
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
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <RevealOnScroll>
            <FuchsiaGlowCard
              variant="card"
              className="h-full rounded-xl border border-white/10 bg-[#111111]"
              contentClassName="flex h-full flex-col p-6 md:p-8"
            >
              <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
                {data.publicArea.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                {data.publicArea.description}
              </p>
              <div className="mt-8 space-y-6">
                {published.map((resource) => (
                  <Link
                    key={resource.slug}
                    href={resource.href}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
                  >
                    <div className="relative aspect-[1024/433] overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={resource.image.src}
                        alt={resource.image.alt}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {resource.tag ? (
                      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
                        {resource.tag}
                      </p>
                    ) : null}
                    <p className="mt-2 text-base font-semibold text-white group-hover:text-leanme-fuchsia">
                      {resource.title}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia">
                      Guarda la puntata →
                    </p>
                  </Link>
                ))}
              </div>
            </FuchsiaGlowCard>
          </RevealOnScroll>
          <RevealOnScroll delay={0.05}>
            <FuchsiaGlowCard
              variant="card"
              className="h-full rounded-xl border border-white/10 bg-[#111111]"
              contentClassName="flex h-full flex-col p-6 md:p-8"
            >
              <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
                {data.reservedArea.title}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65 md:text-base">
                {data.reservedArea.description}
              </p>
              <p className="mt-8 text-center text-sm font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia md:text-base">
                Coming Soon
              </p>
            </FuchsiaGlowCard>
          </RevealOnScroll>
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

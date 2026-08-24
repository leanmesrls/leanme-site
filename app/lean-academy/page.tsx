import { PAGE_CONTENT_AFTER_INTRO_CLASS, PAGE_INTRO_SECTION_CLASS } from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { FuchsiaGlowCard } from "@/components/motion/FuchsiaGlowCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import { getAcademyData, getSeoInPocheParole } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Lean Academy",
  description:
    "Formazione, guide, tutorial e webinar di LeanMe. Area pubblica e area riservata — contenuti in arrivo.",
  path: "/lean-academy",
});

export default function LeanAcademyPage() {
  const data = getAcademyData();
  const summary = getSeoInPocheParole("/lean-academy");

  const areas = [
    {
      id: "public",
      title: data.publicArea.title,
      description: data.publicArea.description,
    },
    {
      id: "reserved",
      title: data.reservedArea.title,
      description: data.reservedArea.description,
    },
  ] as const;

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
          {areas.map((area, index) => (
            <RevealOnScroll key={area.id} delay={index * 0.05}>
              <FuchsiaGlowCard
                variant="card"
                className="h-full rounded-xl border border-white/10 bg-[#111111]"
                contentClassName="flex h-full flex-col p-6 md:p-8"
              >
                <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
                  {area.title}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65 md:text-base">
                  {area.description}
                </p>
                <p className="mt-8 text-center text-sm font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia md:text-base">
                  Coming Soon
                </p>
              </FuchsiaGlowCard>
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

import { PageIntro, PageSection } from "@/components/layout/PageSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getChiSiamoData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Chi siamo",
  description:
    "LeanMe Srls progetta Aziende Ibride. Scopri la nostra visione, il metodo e l'impegno verso persone e innovazione.",
  path: "/chi-siamo",
});

export default function ChiSiamoPage() {
  const data = getChiSiamoData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Chi siamo", path: "/chi-siamo" },
        ])}
      />
      <PageSection>
        <PageIntro
          title={data.intro.title}
          subtitle={data.intro.subtitle}
          description={data.intro.description}
        />
        <div className="mt-16 space-y-16">
          {data.sections.map((section, index) => (
            <RevealOnScroll key={section.id} delay={index * 0.05}>
              <article id={section.id} className="max-w-3xl">
                <h2 className="text-xl font-bold tracking-[0.04em] text-white md:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-6 space-y-4">
                  {section.content.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-base leading-relaxed text-white/70 md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </PageSection>
    </>
  );
}

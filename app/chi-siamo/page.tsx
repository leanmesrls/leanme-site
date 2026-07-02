import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
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
      <section className="section-padding">
        <Container>
          <FadeIn>
            <SectionHeading
              title={data.intro.title}
              subtitle={data.intro.subtitle}
              description={data.intro.description}
            />
          </FadeIn>
          <div className="mt-20 space-y-20">
            {data.sections.map((section, index) => (
              <RevealOnScroll key={section.id} delay={index * 0.05}>
                <article id={section.id}>
                  <h2 className="text-2xl font-semibold md:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-6 space-y-4">
                    {section.content.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-lg leading-relaxed text-leanme-gray-700"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

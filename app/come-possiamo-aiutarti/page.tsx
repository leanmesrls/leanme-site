import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getPercorsiData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Come possiamo aiutarti",
  description:
    "Percorsi su misura per innovare la tua azienda, strutture sanitarie, società scientifiche, eventi e comunicazione.",
  path: "/come-possiamo-aiutarti",
});

export default function ComePossiamoAiutartiPage() {
  const data = getPercorsiData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Come possiamo aiutarti", path: "/come-possiamo-aiutarti" },
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
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {data.percorsi.map((percorso, index) => (
              <RevealOnScroll key={percorso.slug} delay={index * 0.08}>
                <Card href={`/come-possiamo-aiutarti/${percorso.slug}`}>
                  <PlaceholderImage
                    image={percorso.image}
                    aspectRatio="video"
                    className="rounded-none border-none"
                  />
                  <div className="p-8">
                    <h2 className="text-xl font-semibold">{percorso.title}</h2>
                    <p className="mt-3 text-leanme-gray-600">
                      {percorso.shortDescription}
                    </p>
                  </div>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

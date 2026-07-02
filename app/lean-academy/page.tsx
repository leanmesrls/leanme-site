import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getAcademyData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Lean Academy",
  description:
    "Formazione, guide, tutorial e webinar di LeanMe. Area pubblica e area riservata per corsi premium e certificazioni.",
  path: "/lean-academy",
});

export default function LeanAcademyPage() {
  const data = getAcademyData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lean Academy", path: "/lean-academy" },
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

          <div className="mt-20">
            <h2 className="text-2xl font-semibold">{data.publicArea.title}</h2>
            <p className="mt-4 max-w-3xl text-leanme-gray-600">
              {data.publicArea.description}
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {data.publicArea.resources.map((resource, index) => (
                <RevealOnScroll key={resource.slug} delay={index * 0.06}>
                  <Card href={`/lean-academy/${resource.slug}`}>
                    <PlaceholderImage
                      image={resource.image}
                      aspectRatio="video"
                      className="rounded-none border-none"
                    />
                    <div className="p-6">
                      <Badge>{resource.type}</Badge>
                      <h3 className="mt-3 text-xl font-semibold">
                        {resource.title}
                      </h3>
                      <p className="mt-2 text-sm text-leanme-gray-600">
                        {resource.description}
                      </p>
                    </div>
                  </Card>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div className="mt-20 rounded-3xl border border-leanme-black/5 bg-leanme-gray-50 p-8 md:p-12">
            <h2 className="text-2xl font-semibold">{data.reservedArea.title}</h2>
            <p className="mt-4 max-w-3xl text-leanme-gray-600">
              {data.reservedArea.description}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {data.reservedArea.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-leanme-gray-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-leanme-purple" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-leanme-gray-500">
              L&apos;architettura è predisposta per autenticazione, livelli di
              accesso e integrazione LMS. Area riservata in arrivo.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

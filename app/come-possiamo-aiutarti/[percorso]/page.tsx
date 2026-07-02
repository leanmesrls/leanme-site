import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  getAllPercorsoSlugs,
  getPercorsoBySlug,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ percorso: string }>;
}

export async function generateStaticParams() {
  return getAllPercorsoSlugs().map((percorso) => ({ percorso }));
}

export async function generateMetadata({ params }: PageProps) {
  const { percorso: slug } = await params;
  const percorso = getPercorsoBySlug(slug);

  if (!percorso) {
    return createPageMetadata({
      title: "Percorso non trovato",
      description: "Il percorso richiesto non esiste.",
      path: `/come-possiamo-aiutarti/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: percorso.title,
    description: percorso.shortDescription,
    path: `/come-possiamo-aiutarti/${slug}`,
    image: percorso.image.src,
  });
}

export default async function PercorsoPage({ params }: PageProps) {
  const { percorso: slug } = await params;
  const percorso = getPercorsoBySlug(slug);

  if (!percorso) {
    notFound();
  }

  const path = `/come-possiamo-aiutarti/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Come possiamo aiutarti", path: "/come-possiamo-aiutarti" },
            { name: percorso.title, path },
          ]),
          serviceSchema({
            name: percorso.title,
            description: percorso.description,
            path,
          }),
        ]}
      />
      <section className="section-padding">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-leanme-purple">
                Percorso
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {percorso.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-leanme-gray-700">
                {percorso.description}
              </p>
              <ul className="mt-8 space-y-3">
                {percorso.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-3 text-leanme-gray-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leanme-purple" />
                    {service}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href="/contatti" label="Contattaci" variant="primary" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <PlaceholderImage image={percorso.image} aspectRatio="square" />
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, ServiceIcon } from "@/components/homepage/Icons";
import { PageSection } from "@/components/layout/PageSection";
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
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="mb-4 inline-flex rounded-full border border-leanme-purple/40 p-3">
              <ServiceIcon name={percorso.icon} />
            </div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-leanme-purple">
              Percorso
            </p>
            <h1 className="text-3xl font-bold tracking-[0.04em] text-white md:text-4xl">
              {percorso.title.toUpperCase()}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              {percorso.description}
            </p>
            <ul className="mt-8 space-y-3">
              {percorso.services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 text-white/75"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leanme-purple" />
                  {service}
                </li>
              ))}
            </ul>
            <Link
              href="/contatti"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-leanme-purple px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-purple/90"
            >
              Contattaci
              <ArrowIcon />
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
              <Image
                src={percorso.image.src}
                alt={percorso.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>
      </PageSection>
    </>
  );
}

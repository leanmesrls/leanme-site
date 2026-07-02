import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  getAcademyData,
  getAllAcademyResourceSlugs,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAcademyResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resource = getAcademyData().publicArea.resources.find(
    (r) => r.slug === slug
  );

  if (!resource) {
    return createPageMetadata({
      title: "Risorsa non trovata",
      description: "La risorsa richiesta non esiste.",
      path: `/lean-academy/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: resource.title,
    description: resource.description,
    path: `/lean-academy/${slug}`,
    image: resource.image.src,
  });
}

export default async function AcademyResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getAcademyData().publicArea.resources.find(
    (r) => r.slug === slug
  );

  if (!resource) {
    notFound();
  }

  const path = `/lean-academy/${slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lean Academy", path: "/lean-academy" },
          { name: resource.title, path },
        ])}
      />
      <section className="section-padding">
        <Container>
          <FadeIn>
            <Link
              href="/lean-academy"
              className="mb-6 inline-block text-sm text-leanme-purple hover:text-leanme-black"
            >
              ← Lean Academy
            </Link>
            <Badge>{resource.type}</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              {resource.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-leanme-gray-600">
              {resource.description}
            </p>
            <div className="mt-10">
              <PlaceholderImage image={resource.image} aspectRatio="wide" />
            </div>
            <p className="mt-8 max-w-3xl text-leanme-gray-600">
              Contenuto placeholder. Sostituire con il materiale formativo
              completo ({resource.type}) quando disponibile.
            </p>
            <div className="mt-8">
              <Button href="/contatti" label="Richiedi informazioni" variant="primary" />
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

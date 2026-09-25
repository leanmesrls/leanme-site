import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademyVideoPlayer } from "@/components/academy/AcademyVideoPlayer";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { VisibleBreadcrumb } from "@/components/layout/VisibleBreadcrumb";
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
    (r) => r.slug === slug && r.published
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
    image: resource.video?.poster ?? resource.image.src,
  });
}

export default async function AcademyResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getAcademyData().publicArea.resources.find(
    (r) => r.slug === slug && r.published
  );

  if (!resource) {
    notFound();
  }

  const path = `/lean-academy/${slug}`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Lean Academy", path: "/lean-academy" },
    { name: resource.title, path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <VisibleBreadcrumb items={breadcrumbItems} />
      <PageHero
        id="academy-resource-heading"
        title={resource.title}
        subtitle={resource.type}
      />
      <PageSection className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-32">
        <FadeIn>
          <Link
            href="/lean-academy"
            className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
          >
            ← Lean Academy
          </Link>
          {resource.tag ? (
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
              {resource.tag}
            </p>
          ) : null}
          <PageHighlightBlock paragraphs={resource.description} />
          {resource.video ? (
            <div className="mt-10">
              <AcademyVideoPlayer
                src={resource.video.src}
                poster={resource.video.poster}
                label={resource.title}
              />
            </div>
          ) : null}
          {resource.articleHref ? (
            <Link
              href={resource.articleHref}
              className="mt-8 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
            >
              Leggi la newsletter →
            </Link>
          ) : null}
        </FadeIn>
      </PageSection>
    </>
  );
}

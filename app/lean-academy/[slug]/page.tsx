import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademyVideoPlayer } from "@/components/academy/AcademyVideoPlayer";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { VisibleBreadcrumb } from "@/components/layout/VisibleBreadcrumb";
import { FadeIn } from "@/components/motion/FadeIn";
import { LeanLabArticleAside } from "@/components/leanlab/LeanLabRelatedAside";
import { FaqSection } from "@/components/seo/FaqSection";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import {
  getAcademyData,
  getAllAcademyResourceSlugs,
} from "@/lib/content";
import { buildAcademyResourceAside } from "@/lib/leanlab-aside";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";
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

  const aside = buildAcademyResourceAside(resource);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems),
          ...(resource.faq?.length ? [faqPageSchema(resource.faq, path)] : []),
        ]}
      />
      <VisibleBreadcrumb items={breadcrumbItems} />
      <PageHero
        id="academy-resource-heading"
        title={resource.title}
        subtitle={resource.tag ?? resource.type}
      />
      <PageSection className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-32">
        <div
          className={
            aside
              ? "lg:grid lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start lg:gap-12"
              : undefined
          }
        >
          <FadeIn>
            <Link
              href="/lean-academy"
              className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia transition hover:text-white"
            >
              ← Lean Academy
            </Link>
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
            {resource.faq?.length ? (
              <div className="mt-14 md:mt-16">
                <FaqSection items={resource.faq} framed />
              </div>
            ) : null}
            {resource.inPocheParole?.length ? (
              <div className="mt-8">
                <InPocheParoleBox paragraphs={resource.inPocheParole} />
              </div>
            ) : null}
          </FadeIn>
          {aside ? <LeanLabArticleAside {...aside} /> : null}
        </div>
      </PageSection>
    </>
  );
}

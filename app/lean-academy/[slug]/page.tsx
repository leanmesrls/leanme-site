import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcademyVideoPlayer } from "@/components/academy/AcademyVideoPlayer";
import { AudioPlayer } from "@/components/media/AudioPlayer";
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
import { categoryBadgeFromLabel } from "@/lib/leanlab-category";
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
        subtitleClassName={categoryBadgeFromLabel(resource.tag ?? resource.type)}
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
            {resource.audio && resource.image ? (
              <div className="mt-10 max-w-3xl">
                <Image
                  src={resource.image.src}
                  alt={resource.image.alt}
                  width={resource.image.width ?? 2712}
                  height={resource.image.height ?? 1118}
                  priority
                  className="h-auto w-full rounded-xl"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ) : null}
            {resource.audio ? (
              <div className="mt-6 max-w-3xl">
                <AudioPlayer src={resource.audio.src} label={resource.audio.label} />
              </div>
            ) : null}
            {resource.paragraphs?.length ? (
              <div className="mt-8 max-w-3xl space-y-4">
                {resource.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 64)}
                    className="text-base leading-relaxed text-white/85 md:text-[1.0625rem] md:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { VisibleBreadcrumb } from "@/components/layout/VisibleBreadcrumb";
import { FadeIn } from "@/components/motion/FadeIn";
import { LeanLabArticleBody } from "@/components/leanlab/LeanLabArticleBody";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import {
  getAllLeanLabArticleSlugs,
  getLeanLabArticle,
  getLeanLabCategory,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLeanLabArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getLeanLabArticle(slug);

  if (!article) {
    return createPageMetadata({
      title: "Articolo non trovato",
      description: "L'articolo richiesto non esiste.",
      path: `/leanlab/articolo/${slug}`,
      noIndex: true,
    });
  }

  const description = Array.isArray(article.excerpt)
    ? article.excerpt.join(" ")
    : article.excerpt;

  return createPageMetadata({
    title: article.title,
    description,
    path: `/leanlab/articolo/${slug}`,
    image: article.image.src,
  });
}

export default async function LeanLabArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getLeanLabArticle(slug);

  if (!article) {
    notFound();
  }

  const category = getLeanLabCategory(article.category);
  const path = `/leanlab/articolo/${slug}`;
  const description = Array.isArray(article.excerpt)
    ? article.excerpt.join(" ")
    : article.excerpt;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Dal LeanLab", path: "/leanlab" },
    {
      name: category?.title ?? article.category,
      path: `/leanlab/${article.category}`,
    },
    { name: article.title, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbItems),
          articleSchema({
            title: article.title,
            description,
            path,
            datePublished: article.date,
            author: article.author,
            image: article.image.src,
          }),
        ]}
      />
      <VisibleBreadcrumb items={breadcrumbItems} />
      <PageHero
        id="leanlab-article-heading"
        title={article.title}
        subtitle={category?.title ?? article.category}
      />
      <PageSection className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-32">
        <FadeIn>
          <Link
            href={`/leanlab/${article.category}`}
            className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
          >
            ← {category?.title ?? article.category}
          </Link>
          <PageHighlightBlock paragraphs={article.excerpt} />
          <div className="mt-8 space-y-1 text-sm text-white/50">
            <p>
              {formatDate(article.date)} · {article.readTime} di lettura
            </p>
            <p>Written by: {article.author}</p>
          </div>
          {!article.hideDefaultImage ? (
            <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                className="object-cover object-top"
                sizes="100vw"
                priority
              />
            </div>
          ) : null}
          <div className={article.bodyTemplate ? "mt-10" : "mt-10 max-w-3xl"}>
            {article.bodyTemplate ? (
              <LeanLabArticleBody template={article.bodyTemplate} />
            ) : (
              <p className="leading-relaxed text-white/65">
                Contenuto completo dell&apos;articolo LeanLab in arrivo. Ogni
                articolo genererà condivisione su Newsletter, LinkedIn, Facebook e
                Instagram.
              </p>
            )}
          </div>
          {article.inPocheParole?.length ? (
            <div className="mt-14 md:mt-16">
              <InPocheParoleBox paragraphs={article.inPocheParole} />
            </div>
          ) : null}
        </FadeIn>
      </PageSection>
    </>
  );
}

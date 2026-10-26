import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { VisibleBreadcrumb } from "@/components/layout/VisibleBreadcrumb";
import { ArticleCard } from "@/components/leanlab/ArticleCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import {
  getAllLeanLabCategorySlugs,
  getLeanLabArticlesByCategory,
  getLeanLabCategory,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateStaticParams() {
  return getAllLeanLabCategorySlugs().map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: PageProps) {
  const { categoria } = await params;
  const category = getLeanLabCategory(categoria);

  if (!category) {
    return createPageMetadata({
      title: "Categoria non trovata",
      description: "La categoria richiesta non esiste.",
      path: `/leanlab/${categoria}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.title,
    description: category.description,
    path: `/leanlab/${categoria}`,
  });
}

export default async function LeanLabCategoryPage({ params }: PageProps) {
  const { categoria } = await params;
  const category = getLeanLabCategory(categoria);

  if (!category) {
    notFound();
  }

  const articles = getLeanLabArticlesByCategory(categoria);
  const path = `/leanlab/${categoria}`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Dal LeanLab", path: "/leanlab" },
    { name: category.title, path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      <VisibleBreadcrumb items={breadcrumbItems} />
      <PageHero
        id="leanlab-category-heading"
        title={category.title}
        subtitle="Dal LeanLab"
      />
      <PageSection className="pt-8 pb-20 md:pt-10 md:pb-28 lg:pb-32">
        <FadeIn>
          <Link
            href="/leanlab"
            className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
          >
            ← Torna al LeanLab
          </Link>
          <PageHighlightBlock paragraphs={category.description} />
          {articles.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <RevealOnScroll key={article.slug} delay={index * 0.05}>
                  <ArticleCard article={article} />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-white/45">
              Nessun articolo in questa categoria al momento.
            </p>
          )}
        </FadeIn>
      </PageSection>
    </>
  );
}

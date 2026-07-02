import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Dal LeanLab", path: "/leanlab" },
          { name: category.title, path },
        ])}
      />
      <section className="section-padding">
        <Container>
          <FadeIn>
            <Link
              href="/leanlab"
              className="mb-6 inline-block text-sm text-leanme-purple hover:text-leanme-black"
            >
              ← Torna al LeanLab
            </Link>
            <SectionHeading
              title={category.title}
              description={category.description}
            />
          </FadeIn>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <RevealOnScroll key={article.slug} delay={index * 0.06}>
                <ArticleCard article={article} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

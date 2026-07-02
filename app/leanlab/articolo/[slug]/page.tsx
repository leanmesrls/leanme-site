import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
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

  return createPageMetadata({
    title: article.title,
    description: article.excerpt,
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

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Dal LeanLab", path: "/leanlab" },
            {
              name: category?.title ?? article.category,
              path: `/leanlab/${article.category}`,
            },
            { name: article.title, path },
          ]),
          articleSchema({
            title: article.title,
            description: article.excerpt,
            path,
            datePublished: article.date,
            author: article.author,
            image: article.image.src,
          }),
        ]}
      />
      <article className="section-padding">
        <Container>
          <FadeIn>
            <Link
              href={`/leanlab/${article.category}`}
              className="mb-6 inline-block text-sm text-leanme-purple hover:text-leanme-black"
            >
              ← {category?.title ?? article.category}
            </Link>
            <Badge>{category?.title ?? article.category}</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-sm text-leanme-gray-500">
              {formatDate(article.date)} · {article.readTime} · {article.author}
            </p>
            <div className="mt-10">
              <PlaceholderImage image={article.image} aspectRatio="wide" />
            </div>
            <div className="prose prose-lg mt-10 max-w-3xl">
              <p className="text-xl leading-relaxed text-leanme-gray-700">
                {article.excerpt}
              </p>
              <p className="mt-6 leading-relaxed text-leanme-gray-600">
                Questo articolo è un contenuto placeholder. Sostituire con il
                testo completo dell&apos;articolo LeanLab quando disponibile.
                Ogni articolo genererà condivisione su Newsletter, LinkedIn,
                Facebook e Instagram.
              </p>
            </div>
          </FadeIn>
        </Container>
      </article>
    </>
  );
}

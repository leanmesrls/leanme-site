import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageSection } from "@/components/layout/PageSection";
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
      <PageSection>
        <FadeIn>
          <Link
            href={`/leanlab/${article.category}`}
            className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
          >
            ← {category?.title ?? article.category}
          </Link>
          <span className="inline-block rounded-full border border-leanme-purple/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-purple">
            {category?.title ?? article.category}
          </span>
          <h1 className="mt-6 max-w-4xl text-3xl font-bold tracking-[0.03em] text-white md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-white/50">
            {formatDate(article.date)} · {article.readTime} di lettura · {article.author}
          </p>
          <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="mt-10 max-w-3xl">
            <p className="text-xl leading-relaxed text-white/80">{article.excerpt}</p>
            <p className="mt-6 leading-relaxed text-white/65">
              Contenuto completo dell&apos;articolo LeanLab in arrivo. Ogni
              articolo genererà condivisione su Newsletter, LinkedIn, Facebook e
              Instagram.
            </p>
          </div>
        </FadeIn>
      </PageSection>
    </>
  );
}

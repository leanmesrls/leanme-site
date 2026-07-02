import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/leanlab/ArticleCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import {
  getLeanLabArticles,
  getLeanLabCategories,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Dal LeanLab",
  description:
    "Il blog ufficiale LeanMe. Progetti conclusi, ricerca, vita in LeanMe e tutorial dal laboratorio di innovazione.",
  path: "/leanlab",
});

export default function LeanLabPage() {
  const categories = getLeanLabCategories();
  const articles = getLeanLabArticles();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Dal LeanLab", path: "/leanlab" },
        ])}
      />
      <section className="section-padding">
        <Container>
          <FadeIn>
            <SectionHeading
              title="Dal LeanLab"
              subtitle="Il laboratorio di innovazione"
              description="LeanLab è il luogo dove sperimentiamo, testiamo nuove tecnologie e trasformiamo intuizioni in soluzioni reali."
            />
          </FadeIn>

          <div className="mt-12 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link key={category.slug} href={`/leanlab/${category.slug}`}>
                <Badge>{category.title}</Badge>
              </Link>
            ))}
          </div>

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

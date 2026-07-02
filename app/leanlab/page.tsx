import { LeanLabCarousel } from "@/components/homepage/LeanLabCarousel";
import { PageIntro, PageSection } from "@/components/layout/PageSection";
import {
  getHomepageData,
  getLeanLabArticles,
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
  const homepage = getHomepageData();
  const articles = getLeanLabArticles();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Dal LeanLab", path: "/leanlab" },
        ])}
      />
      <PageSection>
        <PageIntro
          title="Dal LeanLab"
          subtitle="Il laboratorio di innovazione"
          description="LeanLab è il luogo dove sperimentiamo, testiamo nuove tecnologie e trasformiamo intuizioni in soluzioni reali."
        />
      </PageSection>
      <LeanLabCarousel data={homepage.leanLab} articles={articles} />
    </>
  );
}

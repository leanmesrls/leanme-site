import { LegalDocument } from "@/components/legal/LegalDocument";
import { PAGE_CONTENT_AFTER_INTRO_CLASS } from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTerminiIaData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Termini IA",
  description:
    "Termini e condizioni sull'uso degli assistenti di Intelligenza Artificiale LeanMe (Lean.Agent.Teresa).",
  path: "/termini-ia",
});

export default function TerminiIaPage() {
  const data = getTerminiIaData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Termini IA", path: "/termini-ia" },
        ])}
      />
      <PageHero id="termini-ia-heading" title={data.hero.title} />
      <PageSection className={PAGE_CONTENT_AFTER_INTRO_CLASS}>
        <LegalDocument data={data} />
      </PageSection>
    </>
  );
}

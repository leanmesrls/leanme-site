import { LegalDocument } from "@/components/legal/LegalDocument";
import { PAGE_CONTENT_AFTER_INTRO_CLASS } from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPrivacyEventiData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Privacy — Organizzazione eventi",
  description:
    "Informativa sul trattamento dei dati personali per l'organizzazione e la gestione di eventi di LeanMe S.r.l.s., ai sensi del GDPR.",
  path: "/privacy/organizzazione-eventi",
});

export default function PrivacyEventiPage() {
  const data = getPrivacyEventiData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
          {
            name: "Organizzazione eventi",
            path: "/privacy/organizzazione-eventi",
          },
        ])}
      />
      <PageHero
        id="privacy-eventi-heading"
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        subtitleClassName="max-w-3xl text-sm font-medium leading-relaxed tracking-normal text-white/80 md:text-base"
      />
      <PageSection className={PAGE_CONTENT_AFTER_INTRO_CLASS}>
        <LegalDocument data={data} />
      </PageSection>
    </>
  );
}

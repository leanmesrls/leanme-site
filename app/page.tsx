import { ContactBanner } from "@/components/homepage/ContactBanner";
import { HomeHero } from "@/components/homepage/HomeHero";
import { LeanAcademySection } from "@/components/homepage/LeanAcademySection";
import { LeanAgentAiSection } from "@/components/homepage/LeanAgentAiSection";
import { LeanLabCarousel } from "@/components/homepage/LeanLabCarousel";
import { ServicesSection } from "@/components/homepage/ServicesSection";
import { TestimonialsPartnersSection } from "@/components/homepage/TestimonialsPartnersSection";
import { PageSection } from "@/components/layout/PageSection";
import { InPocheParoleBox } from "@/components/seo/InPocheParoleBox";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getContattiData,
  getHomepageData,
  getLeanLabArticles,
  getPartnerLogos,
  getPercorsiData,
  getSeoInPocheParole,
  getTestimonials,
} from "@/lib/content";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { homepageSchema } from "@/lib/structured-data";

const homepageDescription =
  "LeanMe Srls progetta Aziende Ibride attraverso Intelligenza Artificiale, automazione e trasformazione digitale. Uno staff ibrido Human + AI Agents. Powered by Human Intelligence. Amplified by AI.";

export const metadata = createPageMetadata({
  title: "LeanMe | Aziende Ibride — Open Innovation Hub",
  description: homepageDescription,
  path: "/",
  image: "/assets/official/reception-render.png",
});

export default function HomePage() {
  const homepage = getHomepageData();
  const { consultationCta } = getPercorsiData();
  const articles = getLeanLabArticles();
  const testimonials = getTestimonials();
  const partnerLogos = getPartnerLogos();
  const summary = getSeoInPocheParole("/");
  const openingHoursLine = getContattiData().openingHours?.lines?.[0];

  const structuredData = homepageSchema({
    description: homepageDescription,
    services: homepage.services.items.map((item) => ({
      name: item.title,
      description: item.description,
      url: `${SITE_URL}${item.href}`,
    })),
    agents: homepage.leanAgentAi.agents.map((agent) => ({
      name: agent.name,
      role: agent.role,
      url: `${SITE_URL}${agent.href}`,
    })),
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="homepage-flow">
        <HomeHero data={homepage.hero} />
        <div className="homepage-band homepage-band-lift">
          <LeanAgentAiSection data={homepage.leanAgentAi} />
        </div>
        <div className="homepage-band homepage-band-deep">
          <ServicesSection data={homepage.services} consultationCta={consultationCta} />
        </div>
        <div className="homepage-band homepage-band-lift">
          <LeanLabCarousel data={homepage.leanLab} articles={articles} />
        </div>
        <div className="homepage-band homepage-band-deep">
          <LeanAcademySection data={homepage.leanAcademy} />
        </div>
        <div className="homepage-band homepage-band-lift">
          <TestimonialsPartnersSection
            testimonials={testimonials}
            testimonialsData={homepage.testimonials}
            partnersData={homepage.partners}
            partnerLogos={partnerLogos}
          />
        </div>
        {summary.length > 0 ? (
          <div className="homepage-band homepage-band-deep">
            <PageSection className="py-12 md:py-16">
              <InPocheParoleBox paragraphs={summary} />
            </PageSection>
          </div>
        ) : null}
        <ContactBanner
          data={homepage.contactBanner}
          openingHoursLine={openingHoursLine}
        />
      </div>
    </>
  );
}

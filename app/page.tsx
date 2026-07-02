import { ContactBanner } from "@/components/homepage/ContactBanner";
import { HomeHero } from "@/components/homepage/HomeHero";
import { LeanAcademySection } from "@/components/homepage/LeanAcademySection";
import { LeanAgentAiSection } from "@/components/homepage/LeanAgentAiSection";
import { LeanLabCarousel } from "@/components/homepage/LeanLabCarousel";
import { ServicesSection } from "@/components/homepage/ServicesSection";
import { TestimonialsPartnersSection } from "@/components/homepage/TestimonialsPartnersSection";
import {
  getHomepageData,
  getLeanLabArticles,
  getTestimonials,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "LeanMe | Aziende Ibride",
  description:
    "LeanMe Srls progetta Aziende Ibride attraverso Intelligenza Artificiale, automazione e trasformazione digitale. Powered by Human Intelligence. Amplified by AI.",
  path: "/",
  image: "/assets/official/reception-render.jpg",
});

export default function HomePage() {
  const homepage = getHomepageData();
  const articles = getLeanLabArticles();
  const testimonials = getTestimonials();

  return (
    <>
      <HomeHero data={homepage.hero} />
      <LeanAgentAiSection data={homepage.leanAgentAi} />
      <ServicesSection data={homepage.services} />
      <LeanLabCarousel data={homepage.leanLab} articles={articles} />
      <LeanAcademySection data={homepage.leanAcademy} />
      <TestimonialsPartnersSection
        testimonials={testimonials}
        testimonialsData={homepage.testimonials}
        partnersData={homepage.partners}
      />
      <ContactBanner data={homepage.contactBanner} />
    </>
  );
}

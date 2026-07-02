import { HeroSection } from "@/components/sections/HeroSection";
import { HumanAiSection } from "@/components/sections/HumanAiSection";
import { PercorsiTrasformazioneSection } from "@/components/sections/PercorsiTrasformazioneSection";
import { SoluzioniSuMisuraSection } from "@/components/sections/SoluzioniSuMisuraSection";
import { MetodoLeanMeSection } from "@/components/sections/MetodoLeanMeSection";
import { LeanAgentTeamSection } from "@/components/sections/LeanAgentTeamSection";
import { LeanLabSection } from "@/components/sections/LeanLabSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { getHomepageData, getTestimonials } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "LeanMe | Aziende Ibride",
  description:
    "LeanMe Srls progetta Aziende Ibride attraverso Intelligenza Artificiale, automazione e trasformazione digitale.",
  path: "/",
});

export default function HomePage() {
  const homepage = getHomepageData();
  const testimonials = getTestimonials();

  return (
    <>
      <HeroSection data={homepage.hero} />
      <HumanAiSection data={homepage.humanAi} />
      <PercorsiTrasformazioneSection data={homepage.percorsiTrasformazione} />
      <SoluzioniSuMisuraSection data={homepage.soluzioniSuMisura} />
      <MetodoLeanMeSection data={homepage.metodoLeanMe} />
      <LeanAgentTeamSection data={homepage.leanAgentTeam} />
      <LeanLabSection data={homepage.leanLab} />
      <CaseStudiesSection data={homepage.caseStudies} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection data={homepage.cta} />
    </>
  );
}

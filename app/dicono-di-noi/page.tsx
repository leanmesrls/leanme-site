import { TestimonialsPartnersSection } from "@/components/homepage/TestimonialsPartnersSection";
import { getHomepageData, getTestimonials } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Dicono di noi",
  description:
    "Testimonianze di clienti e partner che hanno scelto LeanMe per innovare con l'Azienda Ibrida.",
  path: "/dicono-di-noi",
});

export default function DiconoDiNoiPage() {
  const testimonials = getTestimonials();
  const homepage = getHomepageData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Dicono di noi", path: "/dicono-di-noi" },
        ])}
      />
      <TestimonialsPartnersSection
        testimonials={testimonials}
        testimonialsData={homepage.testimonials}
        partnersData={homepage.partners}
      />
    </>
  );
}

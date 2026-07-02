import { GraduationCapIcon } from "@/components/homepage/Icons";
import { PageIntro, PageSection } from "@/components/layout/PageSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getAcademyData } from "@/lib/content";
import { ASSETS } from "@/lib/assets";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Lean Academy",
  description:
    "Formazione, guide, tutorial e webinar di LeanMe. Area pubblica e area riservata per corsi premium e certificazioni.",
  path: "/lean-academy",
});

export default function LeanAcademyPage() {
  const data = getAcademyData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Lean Academy", path: "/lean-academy" },
        ])}
      />
      <PageSection>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PageIntro
            title={data.intro.title}
            subtitle={data.intro.subtitle}
            description={data.intro.description}
          />
          <div className="hidden justify-center lg:flex">
            <GraduationCapIcon className="h-48 w-auto" />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
            {data.publicArea.title}
          </h2>
          <p className="mt-4 max-w-3xl text-white/65">{data.publicArea.description}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {data.publicArea.resources.map((resource, index) => (
              <RevealOnScroll key={resource.slug} delay={index * 0.05}>
                <Link
                  href={`/lean-academy/${resource.slug}`}
                  className="group block overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition hover:border-leanme-purple/30"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={ASSETS.decorative.bannerAmbient}
                      alt={resource.title}
                      fill
                      className="object-cover opacity-80 transition group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-purple">
                      {resource.type}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white">{resource.title}</h3>
                    <p className="mt-2 text-sm text-white/60">{resource.description}</p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-white/10 bg-[#111111] p-8 md:p-12">
          <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-white">
            {data.reservedArea.title}
          </h2>
          <p className="mt-4 max-w-3xl text-white/65">{data.reservedArea.description}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.reservedArea.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-leanme-purple" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </PageSection>
    </>
  );
}

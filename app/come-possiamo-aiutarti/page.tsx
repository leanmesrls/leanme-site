import Link from "next/link";
import { ArrowIcon, ServiceIcon } from "@/components/homepage/Icons";
import { PageIntro, PageSection } from "@/components/layout/PageSection";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { getPercorsiData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Come possiamo aiutarti",
  description:
    "Percorsi su misura per innovare la tua azienda, strutture sanitarie, società scientifiche, eventi e comunicazione.",
  path: "/come-possiamo-aiutarti",
});

export default function ComePossiamoAiutartiPage() {
  const data = getPercorsiData();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Come possiamo aiutarti", path: "/come-possiamo-aiutarti" },
        ])}
      />
      <PageSection>
        <PageIntro
          title={data.intro.title}
          subtitle={data.intro.subtitle}
          description={data.intro.description}
        />

        <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-5">
          {data.percorsi.map((percorso, index) => (
            <RevealOnScroll key={percorso.slug} delay={index * 0.06}>
              <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#111111] p-6 transition hover:border-leanme-purple/30">
                <ServiceIcon name={percorso.icon} />
                <h2 className="mt-5 min-h-[4.5rem] text-sm font-bold leading-snug tracking-[0.06em] text-white">
                  {percorso.title.toUpperCase()}
                </h2>
                <p className="mt-3 flex-1 text-sm text-white/60">
                  {percorso.shortDescription}
                </p>
                <Link
                  href={`/come-possiamo-aiutarti/${percorso.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
                >
                  SCOPRI I SERVIZI
                  <ArrowIcon />
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-10 divide-y divide-white/10 lg:hidden">
          {data.percorsi.map((percorso) => (
            <Link
              key={percorso.slug}
              href={`/come-possiamo-aiutarti/${percorso.slug}`}
              className="flex items-center gap-4 py-4 transition hover:bg-white/[0.03]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leanme-purple/40">
                <ServiceIcon name={percorso.icon} className="h-5 w-5" />
              </div>
              <span className="flex-1 text-xs font-bold leading-snug tracking-[0.05em] text-white">
                {percorso.title.toUpperCase()}
              </span>
              <ArrowIcon className="shrink-0 text-white/40" />
            </Link>
          ))}
        </div>
      </PageSection>
    </>
  );
}

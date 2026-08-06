import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import type { SegreteriaData } from "@/types/segreteria";

interface SegreteriaHeroProps {
  data: SegreteriaData;
}

export function SegreteriaHero({ data }: SegreteriaHeroProps) {
  const { welcome, leonardo } = data;

  return (
    <section
      aria-labelledby="segreteria-hero-heading"
      className="relative overflow-hidden bg-black px-5 pb-8 pt-8 md:px-10 md:pb-10 md:pt-10 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(230,0,126,0.16),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-5xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
            {welcome.eyebrow}
          </p>
          <h1
            id="segreteria-hero-heading"
            className="mt-2 text-2xl font-bold tracking-[0.04em] text-white md:text-3xl"
          >
            {welcome.title}
          </h1>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-leanme-card shadow-[0_0_24px_rgba(230,0,126,0.16)] sm:mx-0 sm:h-auto sm:w-28 md:w-32">
              <div className="relative h-full min-h-28 w-full">
                <Image
                  src={leonardo.image.src}
                  alt={leonardo.image.alt}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="128px"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left md:px-5 md:py-5">
              <div className="space-y-3">
                {welcome.introParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-relaxed text-white/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

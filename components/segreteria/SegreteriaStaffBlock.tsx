import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import type { SegreteriaData } from "@/types/segreteria";

interface SegreteriaStaffBlockProps {
  section: SegreteriaData["agents"];
}

export function SegreteriaStaffBlock({ section }: SegreteriaStaffBlockProps) {
  return (
    <section
      id={section.id}
      aria-labelledby="vcards-staff-heading"
      className="bg-black px-5 py-6 md:px-10 md:py-8 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[21/9] w-full bg-black sm:aspect-[2.4/1]">
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <div className="p-4">
                <h2
                  id="vcards-staff-heading"
                  className="text-lg font-bold tracking-[0.03em] text-white md:text-xl"
                >
                  {section.title}
                </h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-leanme-fuchsia">
                  {section.description}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.06} className="flex flex-col justify-center">
            <div data-leonardo-section={section.id}>
              <Link
                href={section.href}
                data-leonardo-action="discover"
                className="leonardo-action inline-flex min-h-11 w-full items-center justify-center rounded-full bg-leanme-fuchsia px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leanme-fuchsia/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leanme-fuchsia focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {section.ctaLabel}
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

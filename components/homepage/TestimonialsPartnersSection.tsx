"use client";

import { useCallback, useEffect, useState } from "react";
import { QuoteIcon } from "@/components/homepage/Icons";
import { PartnerMarquee } from "@/components/homepage/PartnerMarquee";
import { SectionTitle } from "@/components/homepage/SectionTitle";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { PartnerLogo } from "@/lib/companies";
import type { Testimonial } from "@/types/content";
import type { HomepageData } from "@/types/homepage";

interface TestimonialsPartnersSectionProps {
  testimonials: Testimonial[];
  testimonialsData: HomepageData["testimonials"];
  partnersData: HomepageData["partners"];
  partnerLogos: PartnerLogo[];
}

const SLIDE_INTERVAL_MS = 4500;

export function TestimonialsPartnersSection({
  testimonials,
  testimonialsData,
  partnersData,
  partnerLogos,
}: TestimonialsPartnersSectionProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (testimonials.length === 0) return;
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [testimonials.length]
  );

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const current = testimonials[index] ?? testimonials[0];
  if (!current) return null;

  return (
    <RevealOnScroll className="min-w-0">
      <section
        aria-labelledby="testimonials-heading"
        className="section-padding overflow-x-clip bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <SectionTitle
              id="testimonials-heading"
              align="left"
              underline={false}
            >
              {testimonialsData.title}
            </SectionTitle>
            <QuoteIcon className="mt-8 h-9 w-9 md:h-10 md:w-10" />

            <div
              className="relative mt-6 min-w-0"
              aria-live="polite"
              aria-atomic="true"
            >
              {testimonials.map((item, itemIndex) => (
                <blockquote
                  key={item.id}
                  className={`max-w-full break-words text-sm leading-relaxed text-white transition-opacity duration-300 ease-out md:text-base ${
                    itemIndex === index
                      ? "relative opacity-100"
                      : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
                  }`}
                  aria-hidden={itemIndex !== index}
                >
                  &ldquo;{item.quote}&rdquo;
                  <footer className="mt-6">
                    <cite className="not-italic">
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <p className="break-words text-sm text-white/50">
                        {[item.role, item.company].filter(Boolean).join(", ")}
                      </p>
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>

            <div
              className="mt-8 flex gap-2"
              role="tablist"
              aria-label="Testimonianze"
            >
              {testimonials.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === dotIndex}
                  aria-label={`Testimonianza ${dotIndex + 1} di ${testimonials.length}`}
                  onClick={() => goTo(dotIndex)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === dotIndex ? "bg-leanme-fuchsia" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <SectionTitle id="partners-heading" align="left" underline={false}>
              {partnersData.title}
            </SectionTitle>
            <div className="mt-10 min-w-0 max-w-full">
              <PartnerMarquee logos={partnerLogos} />
            </div>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}

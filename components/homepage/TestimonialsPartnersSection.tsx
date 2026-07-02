"use client";

import { useState } from "react";
import { QuoteIcon } from "@/components/homepage/Icons";
import { SectionTitle } from "@/components/homepage/SectionTitle";
import type { Testimonial } from "@/types/content";
import type { HomepageData } from "@/types/homepage";

interface TestimonialsPartnersSectionProps {
  testimonials: Testimonial[];
  testimonialsData: HomepageData["testimonials"];
  partnersData: HomepageData["partners"];
}

export function TestimonialsPartnersSection({
  testimonials,
  testimonialsData,
  partnersData,
}: TestimonialsPartnersSectionProps) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index] ?? testimonials[0];

  if (!current) return null;

  return (
    <section className="bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle align="left" underline={false}>
            {testimonialsData.title}
          </SectionTitle>
          <QuoteIcon className="mt-8 h-10 w-10" />
          <blockquote className="mt-6 text-lg leading-relaxed text-white md:text-xl">
            &ldquo;{current.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-white">{current.name}</p>
          <p className="text-sm text-white/55">
            {current.role}, {current.company}
          </p>
          <div className="mt-8 flex gap-2">
            {testimonials.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Testimonianza ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={`h-2 w-2 rounded-full transition ${
                  index === dotIndex ? "bg-leanme-purple" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionTitle align="left" underline={false}>
            {partnersData.title}
          </SectionTitle>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
            {partnersData.items.map((partner) => (
              <div
                key={partner}
                className="flex h-16 items-center justify-center rounded-lg border border-white/10 px-4"
              >
                <span className="text-center text-sm font-semibold uppercase tracking-[0.08em] text-white/80">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

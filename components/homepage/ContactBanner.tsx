"use client";

import { ChatIcon } from "@/components/homepage/Icons";
import { ConnectCtaButton } from "@/components/layout/ConnectCtaButton";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import type { HomepageData } from "@/types/homepage";

interface ContactBannerProps {
  data: HomepageData["contactBanner"];
  openingHoursLine?: string;
}

export function ContactBanner({ data, openingHoursLine }: ContactBannerProps) {
  return (
    <RevealOnScroll>
      <section
        aria-labelledby="contact-banner-heading"
        className="contact-banner-animated relative overflow-hidden px-5 py-10 md:px-10 md:py-12 lg:px-16"
      >
        <div
          className="contact-banner-shimmer pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative z-[2] mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <ChatIcon className="mt-0.5 shrink-0 text-white" />
            <div>
              <h2
                id="contact-banner-heading"
                className="text-base font-bold uppercase tracking-[0.06em] text-white md:text-lg lg:text-xl"
              >
                {data.title}
              </h2>
              <p className="mt-1 text-sm text-white/95 md:text-base">
                {data.description}
              </p>
            </div>
          </div>
          <ConnectCtaButton
            href={data.cta.href}
            label={data.cta.label}
            openingHours={openingHoursLine}
            className="max-w-md shrink-0 px-6 py-3 md:max-w-lg"
          />
        </div>
      </section>
    </RevealOnScroll>
  );
}

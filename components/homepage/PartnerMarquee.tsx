"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { PartnerLogo } from "@/lib/companies";

interface PartnerMarqueeProps {
  logos: PartnerLogo[];
}

function PartnerLogoCard({
  partner,
  children,
}: {
  partner: PartnerLogo;
  children: ReactNode;
}) {
  const className =
    "flex h-14 w-[148px] shrink-0 items-center justify-center rounded-md bg-white/95 px-3 py-2 transition md:h-16 md:w-[168px]";

  if (!partner.url) {
    return <div className={className}>{children}</div>;
  }

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Sito di ${partner.name}`}
      className={`${className} hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia`}
    >
      {children}
    </a>
  );
}

export function PartnerMarquee({ logos }: PartnerMarqueeProps) {
  const [paused, setPaused] = useState(false);

  if (logos.length === 0) return null;

  const track = [...logos, ...logos];

  return (
    <div
      className="relative min-w-0 max-w-full overflow-hidden py-2"
      aria-label="Loghi partner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--homepage-band,#000)] to-transparent md:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--homepage-band,#000)] to-transparent md:w-14" />

      <div
        className="partner-marquee-track flex w-max max-w-none gap-6 md:gap-8"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {track.map((partner, index) => (
          <PartnerLogoCard key={`${partner.name}-${index}`} partner={partner}>
            <Image
              src={partner.logo}
              alt={partner.alt}
              width={160}
              height={64}
              className="max-h-9 w-auto max-w-full object-contain md:max-h-11"
            />
          </PartnerLogoCard>
        ))}
      </div>
    </div>
  );
}

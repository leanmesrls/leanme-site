import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/homepage/Icons";
import type { HomepageData } from "@/types/homepage";

interface HomeHeroProps {
  data: HomepageData["hero"];
}

export function HomeHero({ data }: HomeHeroProps) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <Image
        src={data.background}
        alt="Reception LeanMe"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-5 py-28 md:px-10 lg:px-16">
        <p className="max-w-2xl text-[11px] font-medium uppercase tracking-[0.18em] text-white md:text-xs">
          {data.claimPrimary}{" "}
          <span className="text-leanme-purple">{data.claimAccent}</span>
        </p>

        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
          {data.headlinePrefix}{" "}
          <span className="text-leanme-purple">{data.headlineAccent}</span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
          {data.subheadline}
        </p>

        <div className="mt-6 max-w-2xl space-y-3">
          {data.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-white/70 md:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={data.primaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-leanme-purple px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-purple/90 md:text-sm"
          >
            {data.primaryCta.label}
            <ArrowIcon />
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white/5 md:text-sm"
          >
            {data.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

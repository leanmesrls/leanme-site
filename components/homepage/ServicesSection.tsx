import Link from "next/link";
import { ArrowIcon, ServiceIcon } from "@/components/homepage/Icons";
import { SectionTitle } from "@/components/homepage/SectionTitle";
import type { HomepageData } from "@/types/homepage";

interface ServicesSectionProps {
  data: HomepageData["services"];
}

export function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section className="bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionTitle>{data.title}</SectionTitle>

        <div className="mt-12 hidden gap-6 lg:grid lg:grid-cols-5">
          {data.items.map((item) => (
            <div
              key={item.slug}
              className="flex flex-col rounded-xl border border-white/10 bg-[#111111] p-6 transition hover:border-leanme-purple/30"
            >
              <ServiceIcon name={item.icon} />
              <h3 className="mt-5 min-h-[4.5rem] text-sm font-bold leading-snug tracking-[0.06em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-leanme-purple transition hover:text-white"
              >
                {data.linkLabel}
                <ArrowIcon />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 divide-y divide-white/10 lg:hidden">
          {data.items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="flex items-center gap-4 py-4 transition hover:bg-white/[0.03]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leanme-purple/40">
                <ServiceIcon name={item.icon} className="h-5 w-5" />
              </div>
              <span className="flex-1 text-xs font-bold leading-snug tracking-[0.05em] text-white">
                {item.title}
              </span>
              <ArrowIcon className="shrink-0 text-white/40" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

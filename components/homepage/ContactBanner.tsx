import Link from "next/link";
import { ArrowIcon, ChatIcon } from "@/components/homepage/Icons";
import type { HomepageData } from "@/types/homepage";

interface ContactBannerProps {
  data: HomepageData["contactBanner"];
}

export function ContactBanner({ data }: ContactBannerProps) {
  return (
    <section className="bg-[#5a0f96] px-5 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <ChatIcon className="mt-1 shrink-0 text-white" />
          <div>
            <h2 className="text-lg font-bold uppercase tracking-[0.08em] text-white md:text-xl">
              {data.title}
            </h2>
            <p className="mt-1 text-sm text-white/80 md:text-base">{data.description}</p>
          </div>
        </div>
        <Link
          href={data.cta.href}
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-black/80 md:text-sm"
        >
          {data.cta.label}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

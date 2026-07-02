import Link from "next/link";
import { ArrowIcon, GraduationCapIcon } from "@/components/homepage/Icons";
import type { HomepageData } from "@/types/homepage";

interface LeanAcademySectionProps {
  data: HomepageData["leanAcademy"];
}

export function LeanAcademySection({ data }: LeanAcademySectionProps) {
  return (
    <section className="bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-[0.12em] text-white md:text-3xl">
            {data.title}
          </h2>
          <p className="mt-3 text-lg text-leanme-purple">{data.tagline}</p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {data.description}
          </p>
          <Link
            href={data.cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-leanme-purple px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-purple/90 md:text-sm"
          >
            {data.cta.label}
            <ArrowIcon />
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <GraduationCapIcon className="h-40 w-auto md:h-52 lg:h-64" />
        </div>
      </div>
    </section>
  );
}

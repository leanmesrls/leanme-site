import Link from "next/link";
import { ArrowIcon } from "@/components/homepage/Icons";
import {
  PAGE_CONTENT_AFTER_INTRO_CLASS,
  PAGE_INTRO_SECTION_CLASS,
} from "@/components/layout/HighlightCard";
import { PageHero } from "@/components/layout/PageHero";
import { PageHighlightBlock } from "@/components/layout/PageHighlightBlock";
import { PageSection } from "@/components/layout/PageSection";
import { SuiteAppsIcon } from "@/components/layout/SuiteAppsIcon";
import { FuchsiaGlowCard } from "@/components/motion/FuchsiaGlowCard";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSuiteData } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/structured-data";
import type { SuiteTool } from "@/types/content";

export const metadata = createPageMetadata({
  title: "Suite LeanMe",
  description:
    "La Suite LeanMe raccoglie gli strumenti digitali per eventi, formazione e operazioni delle Aziende Ibride. Accedi a LeanEvent e scopri i moduli in arrivo.",
  path: "/suite",
});

function ToolCard({ tool, index }: { tool: SuiteTool; index: number }) {
  const isLive = tool.status === "live" && Boolean(tool.href);
  const card = (
    <FuchsiaGlowCard
      variant="card"
      className="flex h-full flex-col rounded-xl border border-white/10 bg-[#111111] p-6"
      contentClassName="flex h-full flex-col"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
          {tool.eyebrow}
        </p>
        {tool.status === "coming_soon" ? (
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/45">
            In arrivo
          </span>
        ) : null}
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-[0.04em] text-white">
        {tool.name}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
        {tool.description}
      </p>
      <span
        className={`mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] ${
          isLive
            ? "text-leanme-fuchsia transition group-hover:text-white"
            : "text-white/35"
        }`}
      >
        {tool.ctaLabel}
        {isLive ? <ArrowIcon /> : null}
      </span>
    </FuchsiaGlowCard>
  );

  return (
    <RevealOnScroll delay={index * 0.06}>
      <div id={tool.id} className="scroll-mt-24">
        {isLive && tool.href ? (
          tool.external ? (
            <a
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
            >
              {card}
            </a>
          ) : (
            <Link href={tool.href} className="group block h-full">
              {card}
            </Link>
          )
        ) : (
          <div className="h-full opacity-80">{card}</div>
        )}
      </div>
    </RevealOnScroll>
  );
}

export default function SuitePage() {
  const data = getSuiteData();
  const path = "/suite";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Suite", path },
        ])}
      />
      <PageHero
        id="suite-heading"
        title={data.intro.title}
        subtitle={data.intro.subtitle}
      />
      <PageSection className={PAGE_INTRO_SECTION_CLASS}>
        <PageHighlightBlock paragraphs={data.intro.description} />
      </PageSection>
      <PageSection className={PAGE_CONTENT_AFTER_INTRO_CLASS}>
        <div className="mb-8 flex items-center gap-3">
          <SuiteAppsIcon className="h-5 w-5 text-leanme-fuchsia" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
            {data.toolsTitle}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </PageSection>
    </>
  );
}

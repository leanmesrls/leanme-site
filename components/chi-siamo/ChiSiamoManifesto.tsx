import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ChiSiamoHighlightCard } from "@/components/chi-siamo/ChiSiamoHighlightCard";
import { cn } from "@/lib/utils";
import type { ChiSiamoData } from "@/types/content";

interface ChiSiamoManifestoProps {
  manifesto: ChiSiamoData["manifesto"];
  /** Tipografia più compatta sotto le vignette introduttive. */
  compact?: boolean;
}

export function ChiSiamoManifesto({
  manifesto,
  compact = false,
}: ChiSiamoManifestoProps) {
  return (
    <RevealOnScroll>
      <ChiSiamoHighlightCard
        id="manifesto"
        ariaLabelledBy="chi-siamo-manifesto-heading"
      >
        <h2
          id="chi-siamo-manifesto-heading"
          className={cn(
            "font-bold leading-snug tracking-[0.03em] text-leanme-fuchsia",
            compact
              ? "text-lg md:text-xl lg:text-[1.35rem]"
              : "text-xl md:text-2xl lg:text-[1.65rem]"
          )}
        >
          {manifesto.title}
        </h2>
        <div className={cn("space-y-3", compact ? "mt-4" : "mt-6 space-y-4")}>
          {manifesto.content.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className={cn(
                "leading-relaxed text-white/80",
                compact
                  ? "text-sm md:text-[0.95rem]"
                  : "text-base md:text-lg"
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </ChiSiamoHighlightCard>
    </RevealOnScroll>
  );
}

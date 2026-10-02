import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ChiSiamoHighlightCard } from "@/components/chi-siamo/ChiSiamoHighlightCard";
import { categoryBadgeFromLabel } from "@/lib/leanlab-category";
import type { LeanLabPageData } from "@/types/content";

interface LeanLabIntroProps {
  intro: LeanLabPageData["intro"];
}

export function LeanLabIntro({ intro }: LeanLabIntroProps) {
  return (
    <RevealOnScroll>
      <ChiSiamoHighlightCard id="leanlab-intro">
        <div className="space-y-6">
          {intro.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base md:text-lg">
                <span className={categoryBadgeFromLabel(section.title)}>{section.title}</span>
              </h2>
              <div className="mt-3 space-y-3">
                {section.content.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-base leading-relaxed text-white/80 md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ChiSiamoHighlightCard>
    </RevealOnScroll>
  );
}

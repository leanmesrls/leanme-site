import { FadeIn } from "@/components/motion/FadeIn";
import type { FaqItem } from "@/types/content";

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  framed?: boolean;
  compact?: boolean;
}

export function FaqSection({
  items,
  title = "Domande frequenti",
  framed = false,
  compact = false,
}: FaqSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="faq-heading"
      className={
        framed
          ? compact
            ? "rounded-xl border border-leanme-fuchsia/25 bg-gradient-to-br from-leanme-fuchsia/[0.08] to-black p-4"
            : "rounded-xl border border-leanme-fuchsia/25 bg-gradient-to-br from-leanme-fuchsia/[0.08] to-black p-6 md:p-8"
          : "border-t border-white/10 pt-12 md:pt-16"
      }
    >
      <FadeIn>
        <h2
          id="faq-heading"
          className={
            framed
              ? "text-xs font-bold uppercase tracking-[0.12em] text-leanme-fuchsia"
              : "text-sm font-bold uppercase tracking-[0.1em] text-white"
          }
        >
          {title}
        </h2>
      </FadeIn>
      <div className={compact ? "mt-3 divide-y divide-white/10" : "mt-8 divide-y divide-white/10"}>
        {items.map((item, index) => (
          <FadeIn key={item.question} delay={index * 0.04}>
            <details className={compact ? "group py-2.5" : "group py-5"}>
              <summary
                className={`cursor-pointer list-none font-semibold leading-snug text-white transition hover:text-leanme-fuchsia [&::-webkit-details-marker]:hidden ${
                  compact ? "text-sm" : "text-base"
                }`}
              >
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 shrink-0 text-white/40 transition group-open:rotate-45 ${
                      compact ? "text-base" : "text-lg"
                    }`}
                  >
                    +
                  </span>
                </span>
              </summary>
              <p
                className={`max-w-3xl leading-relaxed text-white/70 ${
                  compact ? "mt-2 text-xs" : "mt-4 text-sm"
                }`}
              >
                {item.answer}
              </p>
            </details>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

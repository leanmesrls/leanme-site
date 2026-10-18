import { FadeIn } from "@/components/motion/FadeIn";

interface InPocheParoleBoxProps {
  paragraphs: string[];
  title?: string;
  compact?: boolean;
}

export function InPocheParoleBox({
  paragraphs,
  title = "In poche parole",
  compact = false,
}: InPocheParoleBoxProps) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <aside
      aria-labelledby="in-poche-parole-heading"
      className={
        compact
          ? "rounded-xl border border-leanme-fuchsia/25 bg-gradient-to-br from-leanme-fuchsia/[0.08] to-black p-4"
          : "rounded-xl border border-leanme-fuchsia/25 bg-gradient-to-br from-leanme-fuchsia/[0.08] to-black p-6 md:p-8"
      }
    >
      <FadeIn>
        <h2
          id="in-poche-parole-heading"
          className="text-xs font-bold uppercase tracking-[0.12em] text-leanme-fuchsia"
        >
          {title}
        </h2>
        <div className={compact ? "mt-2 space-y-2" : "mt-4 space-y-3"}>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className={
                compact
                  ? "text-xs leading-relaxed text-white/70"
                  : "text-sm leading-relaxed text-white/75"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </FadeIn>
    </aside>
  );
}

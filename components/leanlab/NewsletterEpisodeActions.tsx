import type { LeanLabArticleCta } from "@/types/content";

const quizClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia";

const videoClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-leanme-fuchsia transition hover:bg-leanme-fuchsia hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia";

export function NewsletterEpisodeActions({
  cta,
  videoCta,
}: {
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
}) {
  if (!cta && !videoCta) return null;

  return (
    <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {cta ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={quizClassName}
        >
          {cta.label}
        </a>
      ) : null}
      {videoCta ? (
        <a
          href={videoCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={videoClassName}
        >
          {videoCta.label}
        </a>
      ) : null}
    </figcaption>
  );
}

export function LeanLabPreviewCtas({
  cta,
  videoCta,
}: {
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
}) {
  if (!cta && !videoCta) {
    return <div className="pb-4" aria-hidden />;
  }

  return (
    <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
      {cta ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          {cta.label} →
        </a>
      ) : null}
      {videoCta ? (
        <a
          href={videoCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.1em] text-white/70 transition hover:text-leanme-fuchsia focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          {videoCta.label} →
        </a>
      ) : null}
    </div>
  );
}

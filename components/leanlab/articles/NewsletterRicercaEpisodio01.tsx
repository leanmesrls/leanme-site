import Image from "next/image";
import Link from "next/link";

import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

/**
 * Newsletter «LeanMe // Ricerca & Innovazione // Episodio 01».
 * Il video si guarda in Lean Academy.
 */
export function NewsletterRicercaEpisodio01({
  videoCta,
}: {
  videoCta?: LeanLabArticleCta;
}) {
  return (
    <div>
      {videoCta ? (
        <Link
          href={videoCta.href}
          className="group relative mb-10 block overflow-hidden rounded-2xl border border-leanme-fuchsia/40 bg-[#14040c] px-6 py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia md:px-10 md:py-12"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 top-6 h-24 w-24 rotate-12 bg-leanme-fuchsia/25 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 -rotate-6 bg-leanme-purple/30 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-16 top-4 h-16 w-16 rounded-full bg-leanme-fuchsia/15"
          />
          <span className="relative block text-[11px] font-semibold uppercase tracking-[0.16em] text-leanme-fuchsia">
            Lean Academy · Ricerca & Innovazione
          </span>
          <span className="relative mt-3 block max-w-xl text-2xl font-bold leading-tight text-white md:text-4xl">
            {videoCta.label}
          </span>
          <span className="relative mt-6 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition group-hover:brightness-110">
            Guarda la puntata →
          </span>
        </Link>
      ) : null}
      <figure className="mx-auto max-w-[860px]">
        {videoCta ? (
          <Link
            href={videoCta.href}
            aria-label={videoCta.label}
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
          >
            <Image
              src={ASSETS.leanlab.newsletterRicercaEpisodio01}
              alt="Newsletter LeanMe Ricerca e Innovazione Episodio 01 — Te lo spiego io. Google non è più l'unico che deve trovare il tuo sito."
              width={1024}
              height={1460}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 860px"
              priority
            />
          </Link>
        ) : (
          <Image
            src={ASSETS.leanlab.newsletterRicercaEpisodio01}
            alt="Newsletter LeanMe Ricerca e Innovazione Episodio 01 — Te lo spiego io. Google non è più l'unico che deve trovare il tuo sito."
            width={1024}
            height={1460}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 860px"
            priority
          />
        )}
        <figcaption className="mt-6 flex justify-center">
          <Link
            href="/prenota-consulenza"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            Ripensiamo insieme il tuo nuovo sito internet!
          </Link>
        </figcaption>
      </figure>
    </div>
  );
}

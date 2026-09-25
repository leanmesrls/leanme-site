import Image from "next/image";
import Link from "next/link";

import { NewsletterEpisodeActions } from "@/components/leanlab/NewsletterEpisodeActions";
import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

/**
 * Newsletter «LeanMe // Ricerca & Innovazione // Episodio 01» — grafica ufficiale, senza modifiche.
 * Il video si guarda in Lean Academy.
 */
export function NewsletterRicercaEpisodio01({
  videoCta,
}: {
  videoCta?: LeanLabArticleCta;
}) {
  return (
    <figure className="mx-auto max-w-[720px]">
      <Image
        src={ASSETS.leanlab.newsletterRicercaEpisodio01}
        alt="Newsletter LeanMe Ricerca e Innovazione Episodio 01 — Te lo spiego io. Google non è più l'unico che deve trovare il tuo sito."
        width={2048}
        height={3072}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
        priority
      />
      <NewsletterEpisodeActions videoCta={videoCta} />
      <div className="mt-6 flex justify-center">
        <Link
          href="/prenota-consulenza"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          Ripensiamo insieme il tuo nuovo sito internet!
        </Link>
      </div>
    </figure>
  );
}

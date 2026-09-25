import Image from "next/image";
import Link from "next/link";

import { ASSETS } from "@/lib/assets";

/**
 * Newsletter «LeanMe // Ricerca & Innovazione // Episodio 01» — grafica ufficiale, senza modifiche.
 * Il video dell'episodio si guarda in pagina.
 */
export function NewsletterRicercaEpisodio01() {
  return (
    <figure className="mx-auto max-w-[720px]">
      <video
        controls
        playsInline
        preload="metadata"
        className="h-auto w-full rounded-xl bg-black"
        aria-label="Te lo spiego io. Episodio 01 con Lean.Agent.Olivetti"
      >
        <source
          src={ASSETS.leanlab.newsletterRicercaEpisodio01Video}
          type="video/mp4"
        />
      </video>
      <Image
        src={ASSETS.leanlab.newsletterRicercaEpisodio01}
        alt="Newsletter LeanMe Ricerca e Innovazione Episodio 01 — Te lo spiego io. Google non è più l'unico che deve trovare il tuo sito."
        width={2048}
        height={3072}
        className="mt-8 h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
        priority
      />
      <figcaption className="mt-6 flex justify-center">
        <Link
          href="/prenota-consulenza"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          Ripensiamo insieme il tuo nuovo sito internet!
        </Link>
      </figcaption>
    </figure>
  );
}

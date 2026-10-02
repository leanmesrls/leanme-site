import Image from "next/image";

import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio03Props {
  cta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 03» — grafica ufficiale, senza modifiche.
 * Se presente, l'intera grafica apre il quiz. Quiz e video stanno nella colonna destra.
 */
export function NewsletterEpisodio03({ cta }: NewsletterEpisodio03Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio03}
      alt="Newsletter LeanMe Rebuild Episodio 03 — Ricostruiamo il modo di lavorare."
      width={1024}
      height={1536}
      className="h-auto w-full"
      sizes="(max-width: 768px) 100vw, 720px"
      priority
    />
  );

  return (
    <figure className="mx-auto max-w-[720px]">
      {cta ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
          aria-label={cta.label}
        >
          {image}
        </a>
      ) : (
        image
      )}
    </figure>
  );
}

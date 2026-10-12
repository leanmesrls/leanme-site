import Image from "next/image";

import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio06Props {
  cta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 06» — grafica ufficiale, senza modifiche.
 * Se presente, l'intera grafica apre la conferma di partecipazione.
 */
export function NewsletterEpisodio06({ cta }: NewsletterEpisodio06Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio06}
      alt="Newsletter LeanMe Open Lab e Brunch — Le idee hanno trovato casa."
      width={682}
      height={1024}
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

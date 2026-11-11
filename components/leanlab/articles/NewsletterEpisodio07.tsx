import Image from "next/image";
import Link from "next/link";

import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio07Props {
  cta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 07» — grafica ufficiale, senza modifiche.
 * L'intera grafica apre la pagina REBUILD 100%.
 */
export function NewsletterEpisodio07({ cta }: NewsletterEpisodio07Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio07}
      alt="Newsletter LeanMe Rebuild Episodio 07 — Le idee hanno trovato casa. Prima e dopo la nuova sede."
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
        <Link
          href={cta.href}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
          aria-label={cta.label}
        >
          {image}
        </Link>
      ) : (
        image
      )}
    </figure>
  );
}

import Image from "next/image";

import { NewsletterEpisodeActions } from "@/components/leanlab/NewsletterEpisodeActions";
import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio05Props {
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 05» — grafica ufficiale, senza modifiche.
 * Se presente, l'intera grafica e un CTA testuale aprono il quiz/form.
 */
export function NewsletterEpisodio05({ cta, videoCta }: NewsletterEpisodio05Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio05}
      alt="Newsletter LeanMe Rebuild Episodio 05 — Dopo la casa digitale, la casa reale."
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
      <NewsletterEpisodeActions cta={cta} videoCta={videoCta} />
    </figure>
  );
}

import Image from "next/image";

import { NewsletterEpisodeActions } from "@/components/leanlab/NewsletterEpisodeActions";
import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio01Props {
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 01» — grafica PNG ufficiale, senza modifiche.
 * Se presente, l'intera grafica apre il quiz; sotto: quiz + video sbloccato.
 */
export function NewsletterEpisodio01({ cta, videoCta }: NewsletterEpisodio01Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio01}
      alt="Newsletter LeanMe Rebuild Episodio 01 — Siamo tornati. E da oggi entri nel cantiere."
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

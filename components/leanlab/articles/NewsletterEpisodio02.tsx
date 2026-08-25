import Image from "next/image";

import { ASSETS } from "@/lib/assets";
import type { LeanLabArticleCta } from "@/types/content";

interface NewsletterEpisodio02Props {
  cta?: LeanLabArticleCta;
}

/**
 * Newsletter «LeanMe // Rebuild // Episodio 02» — grafica ufficiale, senza modifiche.
 * Se presente, l'intera grafica e un CTA testuale aprono il quiz/form.
 */
export function NewsletterEpisodio02({ cta }: NewsletterEpisodio02Props) {
  const image = (
    <Image
      src={ASSETS.leanlab.newsletterEpisodio02}
      alt="Newsletter LeanMe Rebuild Episodio 02 — Ricostruiamo un'identità."
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
      {cta ? (
        <figcaption className="mt-6 text-center">
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            {cta.label}
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}

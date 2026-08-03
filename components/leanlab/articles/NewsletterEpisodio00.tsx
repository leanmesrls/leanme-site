import Image from "next/image";

import { ASSETS } from "@/lib/assets";

/**
 * Newsletter «LeanMe // Rebuild // Episodio 00» — grafica PNG ufficiale, senza modifiche.
 */
export function NewsletterEpisodio00() {
  return (
    <figure className="mx-auto max-w-[720px]">
      <Image
        src={ASSETS.leanlab.newsletterEpisodio00}
        alt="Newsletter LeanMe Rebuild Episodio 00 — Prima di andare in ferie"
        width={682}
        height={1024}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
        priority
      />
    </figure>
  );
}

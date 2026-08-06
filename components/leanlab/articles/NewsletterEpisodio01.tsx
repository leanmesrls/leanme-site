import Image from "next/image";

import { ASSETS } from "@/lib/assets";

/**
 * Newsletter «LeanMe // Rebuild // Episodio 01» — grafica PNG ufficiale, senza modifiche.
 */
export function NewsletterEpisodio01() {
  return (
    <figure className="mx-auto max-w-[720px]">
      <Image
        src={ASSETS.leanlab.newsletterEpisodio01}
        alt="Newsletter LeanMe Rebuild Episodio 01 — Siamo tornati. E da oggi entri nel cantiere."
        width={682}
        height={1024}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
        priority
      />
    </figure>
  );
}

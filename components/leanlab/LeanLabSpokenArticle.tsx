import Image from "next/image";
import Link from "next/link";

import { AudioPlayer } from "@/components/media/AudioPlayer";
import type { LeanLabArticle, LeanLabArticleLink } from "@/types/content";

interface LeanLabSpokenArticleProps {
  article: LeanLabArticle;
}

function RelatedLink({ link }: { link: LeanLabArticleLink }) {
  const className =
    "text-sm font-semibold text-leanme-fuchsia underline decoration-leanme-fuchsia/40 underline-offset-4 transition hover:decoration-leanme-fuchsia focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia";
  const external = link.href.startsWith("http");

  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

/**
 * Articolo parlato: registrazione, ritratto e corpo in blocchi presi dai dati.
 * Il testo è l'alternativa alla traccia audio.
 */
export function LeanLabSpokenArticle({ article }: LeanLabSpokenArticleProps) {
  const prose = "text-base leading-relaxed text-white/85 md:text-[1.0625rem] md:leading-8";

  return (
    <div className="space-y-10">
      {article.hideDefaultImage ? (
        <figure className="overflow-hidden">
          <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              priority
              className="object-cover object-top"
              sizes="280px"
            />
          </div>
        </figure>
      ) : null}

      {article.audio ? <AudioPlayer src={article.audio.src} label={article.audio.label} /> : null}

      {article.blocks?.map((block) => (
        <section key={block.id} aria-labelledby={block.id} className="space-y-4">
          <h2
            id={block.id}
            className="text-xs font-bold uppercase tracking-[0.14em] text-leanme-fuchsia"
          >
            {block.heading}
          </h2>
          {block.audio ? <AudioPlayer src={block.audio.src} label={block.audio.label} /> : null}
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 64)} className={prose}>
              {paragraph}
            </p>
          ))}
          {block.link ? (
            <p>
              <RelatedLink link={block.link} />
            </p>
          ) : null}
        </section>
      ))}

      {article.relatedLinks?.length ? (
        <section aria-labelledby="approfondisci" className="space-y-3">
          <h2
            id="approfondisci"
            className="text-xs font-bold uppercase tracking-[0.14em] text-leanme-fuchsia"
          >
            Per approfondire
          </h2>
          <ul className="space-y-2">
            {article.relatedLinks.map((link) => (
              <li key={link.href}>
                <RelatedLink link={link} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

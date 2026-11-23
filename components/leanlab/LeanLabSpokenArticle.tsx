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
          {article.cta?.href.startsWith("http") ? (
            <a href={article.cta.href} target="_blank" rel="noopener noreferrer">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={article.image.width ?? 1600}
                height={article.image.height ?? 900}
                priority
                className="h-auto w-full rounded-xl"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
              <span className="sr-only"> Si apre in una nuova scheda.</span>
            </a>
          ) : (
            <Image
              src={article.image.src}
              alt={article.image.alt}
              width={article.image.width ?? 1600}
              height={article.image.height ?? 900}
              priority
              className="h-auto w-full rounded-xl"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          )}
        </figure>
      ) : null}

      {article.secondaryImage ? (
        <figure className="max-w-3xl">
          <Image
            src={article.secondaryImage.src}
            alt={article.secondaryImage.alt}
            width={article.secondaryImage.width ?? 1024}
            height={article.secondaryImage.height ?? 1536}
            className="h-auto w-full max-w-[17rem] rounded-xl"
            sizes="272px"
          />
        </figure>
      ) : null}

      {article.audio ? <AudioPlayer src={article.audio.src} label={article.audio.label} /> : null}

      {article.blocks?.map((block) => (
        <section key={block.id} aria-labelledby={block.id} className="max-w-3xl space-y-4">
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

      {article.cta ? (
        <p className="max-w-3xl">
          <a
            href={article.cta.href}
            target={article.cta.href.startsWith("http") ? "_blank" : undefined}
            rel={article.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex max-w-xl items-center justify-center gap-2 rounded-full bg-leanme-fuchsia px-6 py-3 text-center text-sm font-semibold leading-snug text-white transition hover:bg-leanme-fuchsia-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            {article.cta.label}
            {article.cta.href.startsWith("http") ? (
              <span className="sr-only"> Si apre in una nuova scheda.</span>
            ) : null}
          </a>
        </p>
      ) : null}

      {article.relatedLinks?.length ? (
        <section aria-labelledby="approfondisci" className="max-w-3xl space-y-3">
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

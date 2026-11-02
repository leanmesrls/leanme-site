import Image from "next/image";

import articleBodyJson from "@/data/leanlab/digital-twin-gemelli-digitali.json";
import { getLeanLabArticle } from "@/lib/content";

type ParagraphBlock = { type: "p"; text: string };
type HeadingBlock = { type: "h3"; id: string; text: string };
type ListBlock = { type: "ol"; items: string[] };
type DomainsBlock = { type: "domains" };
type ArticleBlock = ParagraphBlock | HeadingBlock | ListBlock | DomainsBlock;

interface DomainSection {
  id: string;
  kicker: string;
  heading: string;
  image: string;
  alt: string;
  paragraphs: string[];
}

interface ArticleBody {
  series: string;
  intro: string[];
  sections: Array<{ id: string; title: string; blocks: ArticleBlock[] }>;
  domains: DomainSection[];
  video: {
    id: string;
    heading: string;
    title: string;
    text: string;
    placeholder: string;
  };
  signoff: string[];
}

const articleBody = articleBodyJson as ArticleBody;

const prose =
  "text-base leading-relaxed text-white/80 md:text-[1.0625rem] md:leading-8";

function RichParagraph({ text }: { text: string }) {
  const markers = ["Esempio pratico:", "Il vantaggio:", "In parole semplici:"];
  const marker = markers.find((item) => text.startsWith(item));

  if (!marker) {
    return <p className={prose}>{text}</p>;
  }

  const rest = text.slice(marker.length);
  const isAdvantage = marker === "Il vantaggio:";

  return (
    <p
      className={
        isAdvantage
          ? `${prose} rounded-r-xl border-l-2 border-[#3ec6ff] bg-[#041018] px-4 py-3 text-white/90`
          : prose
      }
    >
      <strong className="font-semibold text-white">{marker}</strong>
      {rest}
    </p>
  );
}

function DomainSections() {
  return (
    <div className="mt-8 space-y-8">
      {articleBody.domains.map((domain) => (
        <section
          key={domain.id}
          aria-labelledby={domain.id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#090909]"
        >
            <div className="relative aspect-video">
              <Image
                src={domain.image}
                alt={domain.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            </div>
            <div className="p-5 md:p-7 lg:p-8">
              <h3 id={domain.id} className="scroll-mt-28">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
                  {domain.kicker}
                </span>
                <span className="sr-only"> — </span>
                <span className="mt-2 block text-xl font-semibold leading-snug text-white md:text-2xl">
                  {domain.heading}
                </span>
              </h3>
              <div className="mt-5 space-y-4">
                {domain.paragraphs.map((paragraph) => (
                  <RichParagraph key={paragraph} text={paragraph} />
                ))}
              </div>
            </div>
        </section>
      ))}
    </div>
  );
}

function Blocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mt-5 space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <RichParagraph key={`${block.text.slice(0, 24)}-${index}`} text={block.text} />;
        }

        if (block.type === "h3") {
          return (
            <h3
              key={block.id}
              id={block.id}
              className="scroll-mt-28 pt-4 text-xl font-semibold leading-snug text-white md:text-2xl"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "ol") {
          return (
            <ol
              key={`ol-${index}`}
              className="grid list-none gap-3 sm:grid-cols-2"
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={item}
                  className="rounded-xl border border-[#3ec6ff]/30 bg-[#041018] px-4 py-4 text-sm leading-relaxed text-white/85 md:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]"
                  >
                    {itemIndex + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        return <DomainSections key="domains" />;
      })}
    </div>
  );
}

/**
 * Articolo editoriale «Digital Twin: e se potessimo provare il futuro prima di viverlo?».
 * Il video di Te lo spiego io non ha ancora un URL: lo spazio resta vuoto, senza link.
 */
export function DigitalTwinGemelliDigitali() {
  const tags = getLeanLabArticle("digital-twin-gemelli-digitali")?.tags ?? [];

  return (
    <article className="max-w-4xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
        {articleBody.series}
      </p>
      <div className="mt-6 space-y-4">
        {articleBody.intro.map((paragraph) => (
          <p key={paragraph} className={prose}>
            {paragraph}
          </p>
        ))}
      </div>

      {articleBody.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12 md:mt-16">
          <h2
            id={section.id}
            className="scroll-mt-28 text-2xl font-semibold leading-tight text-white md:text-3xl"
          >
            {section.title}
          </h2>
          <Blocks blocks={section.blocks} />
        </section>
      ))}

      <section
        aria-labelledby={articleBody.video.id}
        className="mt-12 rounded-2xl border border-[#3ec6ff]/35 bg-[#041018] p-5 md:mt-16 md:p-8"
      >
        <h2
          id={articleBody.video.id}
          className="scroll-mt-28 text-xl font-semibold uppercase tracking-[0.08em] text-[#8adfff] md:text-2xl"
        >
          {articleBody.video.heading}
        </h2>
        <p className="mt-4 text-xl font-semibold leading-snug text-white md:text-2xl">
          {articleBody.video.title}
        </p>
        <p className={`mt-4 ${prose}`}>{articleBody.video.text}</p>
        <div className="relative mt-6 aspect-video overflow-hidden rounded-xl border border-dashed border-[#3ec6ff]/50 bg-black">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_28%_40%,rgba(62,198,255,0.18),transparent_42%),radial-gradient(circle_at_74%_62%,rgba(230,0,126,0.16),transparent_40%)]"
          />
          <p className="relative flex h-full items-center justify-center px-6 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
            {articleBody.video.placeholder}
          </p>
        </div>
      </section>

      <footer className="mt-12 border-t border-white/10 pt-8">
        {articleBody.signoff.map((line, index) => (
          <p
            key={line}
            className={
              index === 0
                ? "text-sm font-semibold text-white"
                : "mt-1 text-sm text-white/65"
            }
          >
            {line}
          </p>
        ))}
        {tags.length > 0 ? (
          <ul aria-label="Tag" className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </footer>
    </article>
  );
}

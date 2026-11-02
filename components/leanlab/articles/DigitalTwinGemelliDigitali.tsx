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
  signoff: string[];
}

const articleBody = articleBodyJson as ArticleBody;

const prose =
  "text-base leading-relaxed text-white/85 md:text-[1.0625rem] md:leading-8";

const sectionShell: Record<string, string> = {
  "cos-e-un-digital-twin":
    "border-[#3ec6ff]/40 bg-[#04141c] shadow-[inset_0_1px_0_rgba(62,198,255,0.25)]",
  "come-funziona-un-gemello-digitale":
    "border-leanme-fuchsia/45 bg-[#160810] shadow-[inset_0_1px_0_rgba(230,0,126,0.28)]",
  "dove-vengono-utilizzati":
    "border-white/15 bg-[#121216]",
  "digital-twin-e-intelligenza-artificiale":
    "border-[#c4b5fd]/35 bg-[#120c18]",
  "possiamo-davvero-prevedere-il-futuro":
    "border-[#8adfff]/25 bg-[#0c1214]",
  "non-solo-grandi-aziende":
    "border-leanme-fuchsia/30 bg-gradient-to-br from-[#160810] to-[#07141a]",
  "sperimentare-prima-di-intervenire":
    "border-[#3ec6ff]/30 bg-gradient-to-br from-[#07141a] via-[#100812] to-[#160810]",
};

const domainTone = [
  {
    card: "border-leanme-fuchsia/55 bg-[#14060e]",
    kicker: "text-[#ff8ac4]",
    advantage: "border-leanme-fuchsia bg-[#1c0812]",
    example: "bg-leanme-fuchsia/15 text-[#ffd0e6]",
  },
  {
    card: "border-[#3ec6ff]/40 bg-[#04141c]",
    kicker: "text-[#8adfff]",
    advantage: "border-[#3ec6ff] bg-[#041018]",
    example: "bg-[#3ec6ff]/15 text-[#d7f6ff]",
  },
  {
    card: "border-[#c4b5fd]/35 bg-[#120c18]",
    kicker: "text-[#d4c4ff]",
    advantage: "border-[#c4b5fd] bg-[#140c1c]",
    example: "bg-[#c4b5fd]/15 text-[#efe8ff]",
  },
] as const;

const punches = new Set(["No.", "Non necessariamente.", "Ma piuttosto:"]);

function RichParagraph({
  text,
  tone = domainTone[1],
}: {
  text: string;
  tone?: (typeof domainTone)[number];
}) {
  if (punches.has(text)) {
    return <p className="text-2xl font-semibold leading-tight text-white md:text-3xl">{text}</p>;
  }

  if (text.startsWith("«")) {
    return (
      <blockquote className="rounded-r-2xl border-l-4 border-leanme-fuchsia bg-black/35 px-4 py-3 md:px-5">
        <p className="text-lg font-medium leading-snug text-white md:text-xl">{text}</p>
      </blockquote>
    );
  }

  if (text.startsWith("Perché il futuro non possiamo conoscerlo")) {
    return (
      <p className="text-lg font-medium leading-snug text-white md:text-xl">{text}</p>
    );
  }

  const markers = ["Esempio pratico:", "Il vantaggio:", "In parole semplici:"] as const;
  const marker = markers.find((item) => text.startsWith(item));
  if (!marker) {
    return <p className={prose}>{text}</p>;
  }

  const rest = text.slice(marker.length);

  if (marker === "Il vantaggio:") {
    return (
      <p className={`${prose} rounded-r-xl border-l-2 ${tone.advantage} px-4 py-3 text-white`}>
        <strong className="font-semibold">{marker}</strong>
        {rest}
      </p>
    );
  }

  if (marker === "Esempio pratico:") {
    return (
      <p className={prose}>
        <strong
          className={`mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${tone.example}`}
        >
          {marker}
        </strong>
        <span className="block">{rest.replace(/^\s*/, "")}</span>
      </p>
    );
  }

  return (
    <p className={`${prose} rounded-2xl border border-[#3ec6ff]/30 bg-black/30 px-4 py-3`}>
      <strong className="font-semibold text-[#8adfff]">{marker}</strong>
      {rest}
    </p>
  );
}

function DomainSections() {
  return (
    <div className="mt-6">
      <nav aria-label="Sei esempi concreti" className="flex flex-wrap gap-2">
        {articleBody.domains.map((domain, index) => {
          const tone = domainTone[index % domainTone.length];
          return (
            <a
              key={domain.id}
              href={`#${domain.id}`}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia ${tone.card} ${tone.kicker}`}
            >
              {domain.kicker}
            </a>
          );
        })}
      </nav>
      <div className="mt-6 space-y-6">
        {articleBody.domains.map((domain, index) => {
          const tone = domainTone[index % domainTone.length];
          return (
            <section
              key={domain.id}
              aria-labelledby={domain.id}
              className={`overflow-hidden rounded-2xl border ${tone.card}`}
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
              <div className="p-5 md:p-7">
                <h3 id={domain.id} className="scroll-mt-28">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.16em] ${tone.kicker}`}>
                    {domain.kicker}
                  </span>
                  <span className="sr-only"> — </span>
                  <span className="mt-2 block text-xl font-semibold leading-snug text-white md:text-2xl">
                    {domain.heading}
                  </span>
                </h3>
                <div className="mt-5 space-y-4">
                  {domain.paragraphs.map((paragraph) => (
                    <RichParagraph key={paragraph} text={paragraph} tone={tone} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Blocks({
  blocks,
  listTone,
}: {
  blocks: ArticleBlock[];
  listTone: "cyan" | "fuchsia";
}) {
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
              className="scroll-mt-28 rounded-2xl border border-white/15 bg-black/45 px-4 py-4 text-xl font-semibold leading-snug text-white md:px-5 md:text-2xl"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "ol") {
          const chip =
            listTone === "fuchsia"
              ? "border-leanme-fuchsia/40 bg-black/35"
              : "border-[#3ec6ff]/35 bg-black/30";
          const numeral = listTone === "fuchsia" ? "text-[#ff8ac4]" : "text-[#8adfff]";
          return (
            <ol key={`ol-${index}`} className="grid list-none gap-3 sm:grid-cols-2">
              {block.items.map((item, itemIndex) => (
                <li
                  key={item}
                  className={`rounded-xl border px-4 py-4 text-sm leading-relaxed text-white/90 md:text-base ${chip}`}
                >
                  <span
                    aria-hidden="true"
                    className={`mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] ${numeral}`}
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
 * Nessun video: la puntata non è prevista.
 */
export function DigitalTwinGemelliDigitali() {
  const tags = getLeanLabArticle("digital-twin-gemelli-digitali")?.tags ?? [];

  return (
    <article className="max-w-4xl">
      <figure className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
        <Image
          src="/assets/leanlab/digital-twin/hero.jpg"
          alt="Gemello digitale luminoso sospeso sopra una città di notte, tra ospedale, industria e un grande edificio vetrato."
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="(max-width: 1024px) 100vw, 720px"
        />
      </figure>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
        {articleBody.series}
      </p>
      <div className="mt-6 space-y-4">
        {articleBody.intro.map((paragraph, index) =>
          index === 0 ? (
            <p key={paragraph} className="text-xl font-medium leading-snug text-white md:text-2xl">
              {paragraph}
            </p>
          ) : (
            <p key={paragraph} className={prose}>
              {paragraph}
            </p>
          )
        )}
      </div>

      <div className="mt-10 space-y-6 md:mt-12 md:space-y-8">
        {articleBody.sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className={`scroll-mt-28 rounded-3xl border p-5 md:p-8 ${sectionShell[section.id] ?? "border-white/10 bg-[#111]"}`}
          >
            <h2
              id={section.id}
              className="text-2xl font-semibold leading-tight text-white md:text-3xl"
            >
              {section.title}
            </h2>
            <Blocks
              blocks={section.blocks}
              listTone={section.id === "come-funziona-un-gemello-digitale" ? "fuchsia" : "cyan"}
            />
          </section>
        ))}
      </div>

      <footer className="mt-10 rounded-2xl border border-white/10 bg-[#0c0c0c] px-5 py-6 md:px-7">
        {articleBody.signoff.map((line, index) => (
          <p
            key={line}
            className={
              index === 0
                ? "text-sm font-semibold text-white"
                : "mt-1 text-sm text-white/70"
            }
          >
            {line}
          </p>
        ))}
        {tags.length > 0 ? (
          <ul aria-label="Tag" className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/75"
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

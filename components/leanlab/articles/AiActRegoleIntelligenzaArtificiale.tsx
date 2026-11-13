import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import articleBodyJson from "@/data/leanlab/ai-act-regole-intelligenza-artificiale.json";
import { categoryBadgeClass } from "@/lib/leanlab-category";
import { getLeanLabArticle } from "@/lib/content";
import type { LeanLabArticleCta } from "@/types/content";

type ParagraphBlock = { type: "p"; text: string };
type HeadingBlock = { type: "h3"; id: string; text: string };
type ListBlock = { type: "ol" | "ul"; items: string[] };
type RememberBlock = { type: "remember"; title: string; text: string };
type RisksBlock = { type: "risks" };
type WorkExamplesBlock = { type: "work-examples" };
type ArticleBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | RememberBlock
  | RisksBlock
  | WorkExamplesBlock;

interface RiskCard {
  id: string;
  kicker: string;
  heading: string;
  text: string;
}

interface WorkExample {
  id: string;
  kicker: string;
  heading: string;
  situation: string;
  relevance: string;
  evaluate: string;
}

interface SourceLink {
  label: string;
  href: string;
}

interface ArticleBody {
  series: string;
  introTitle: string;
  intro: string[];
  sections: Array<{ id: string; title: string; blocks: ArticleBlock[] }>;
  risks: RiskCard[];
  workExamples: WorkExample[];
  sources: SourceLink[];
  timelineNote: string;
  signoff: string[];
}

const articleBody = articleBodyJson as ArticleBody;

const ACADEMY_HREF = "/lean-academy/ai-act-regole-intelligenza-artificiale";
/** Poster / hero video HQ estratto dal master 4K. */
const COVER = "/assets/leanlab/ai-act-cover.jpg";

const prose =
  "text-base leading-relaxed text-white/85 md:text-[1.0625rem] md:leading-8";

type TopicIconName =
  | "spark"
  | "eye"
  | "shield"
  | "ban"
  | "megaphone"
  | "people"
  | "heart"
  | "headset"
  | "gears"
  | "bookmark"
  | "book"
  | "academy";

const topicIcons: Record<TopicIconName, ReactNode> = {
  spark: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6 6.3 17.7"
    />
  ),
  eye: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3.5 19 6.5v5c0 4.5-2.9 7.8-7 9.5-4.1-1.7-7-5-7-9.5v-5l7-3z"
    />
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" d="M7 7l10 10" />
    </>
  ),
  megaphone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 11v2a2 2 0 002 2h1l3 4h2l-1.2-4H14a6 6 0 006-6V9a6 6 0 00-6-6H9L6 7H6a2 2 0 00-2 2z"
    />
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 18c.6-2.4 2.4-3.5 4.5-3.5s3.9 1.1 4.5 3.5M13.5 18c.3-1.4 1.2-2.4 2.5-2.8"
      />
    </>
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19s-6.5-4.1-8.3-7.2C2.2 9.5 3.4 6.5 6.3 6c1.5-.3 3 .4 3.7 1.6C10.7 6.4 12.2 5.7 13.7 6c2.9.5 4.1 3.5 2.6 5.8C14.5 14.9 12 19 12 19z"
    />
  ),
  headset: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 13V11a7.5 7.5 0 0115 0v2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 13.5v2A1.5 1.5 0 006 17h1.2M19.5 13.5v2a1.5 1.5 0 01-1.5 1.5h-.8"
      />
      <path strokeLinecap="round" d="M14.5 19.5H13a2 2 0 01-2-2v-.5" />
    </>
  ),
  gears: (
    <>
      <circle cx="9" cy="12" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4.5v2M9 17.5v2M3.5 12h2M12.5 12h2M5.2 6.7l1.4 1.4M11.4 13.9l1.4 1.4M5.2 17.3l1.4-1.4M11.4 10.1l1.4-1.4M16 4.5v1.5M16 12.5v2M12.5 9h1.5M18 9h1.5"
      />
    </>
  ),
  bookmark: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 4.5h10a1 1 0 011 1v14l-6-3.5-6 3.5v-14a1 1 0 011-1z"
    />
  ),
  book: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 5.5A2.5 2.5 0 017.5 3H19v15.5H7.5A2.5 2.5 0 005 21V5.5zM5 18.5h12"
    />
  ),
  academy: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5zM6.5 12.5v4.2c0 .8 2.4 2.8 5.5 2.8s5.5-2 5.5-2.8v-4.2"
    />
  ),
};

function TopicIcon({
  name,
  className,
}: {
  name: TopicIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className ?? "h-5 w-5"}
      aria-hidden="true"
    >
      {topicIcons[name]}
    </svg>
  );
}

const workIcons: Record<string, TopicIconName> = {
  "comunicazione-marketing": "megaphone",
  "risorse-umane": "people",
  sanita: "heart",
  "customer-care": "headset",
  "automazioni-aziendali": "gears",
};

const riskIcons: Record<string, TopicIconName> = {
  "rischio-minimo": "spark",
  trasparenza: "eye",
  "alto-rischio": "shield",
  vietato: "ban",
};

const sectionShell: Record<string, string> = {
  "cos-e-l-ai-act":
    "border-[#3ec6ff]/40 bg-[#04141c] shadow-[inset_0_1px_0_rgba(62,198,255,0.25)]",
  "non-tutte-le-ai-sono-uguali":
    "border-leanme-fuchsia/45 bg-[#160810] shadow-[inset_0_1px_0_rgba(230,0,126,0.28)]",
  "cosa-cambia-nel-lavoro-quotidiano": "border-white/15 bg-[#121216]",
  "ai-literacy": "border-[#c4b5fd]/35 bg-[#120c18]",
  "chi-e-responsabile": "border-[#8adfff]/25 bg-[#0c1214]",
  "da-dove-cominciare":
    "border-leanme-fuchsia/30 bg-gradient-to-br from-[#160810] to-[#07141a]",
  conclusione:
    "border-[#3ec6ff]/30 bg-gradient-to-br from-[#07141a] via-[#100812] to-[#160810]",
};

const riskTone = [
  {
    card: "border-[#3ec6ff]/40 bg-[#04141c]",
    kicker: "text-[#8adfff]",
  },
  {
    card: "border-[#c4b5fd]/35 bg-[#120c18]",
    kicker: "text-[#d4c4ff]",
  },
  {
    card: "border-leanme-fuchsia/55 bg-[#14060e]",
    kicker: "text-[#ff8ac4]",
  },
  {
    card: "border-white/20 bg-[#101010]",
    kicker: "text-white/70",
  },
] as const;

const workTone = [
  {
    card: "border-leanme-fuchsia/45 bg-[#14060e]",
    kicker: "text-[#ff8ac4]",
    label: "border-leanme-fuchsia bg-[#1c0812]",
  },
  {
    card: "border-[#3ec6ff]/40 bg-[#04141c]",
    kicker: "text-[#8adfff]",
    label: "border-[#3ec6ff] bg-[#041018]",
  },
  {
    card: "border-[#c4b5fd]/35 bg-[#120c18]",
    kicker: "text-[#d4c4ff]",
    label: "border-[#c4b5fd] bg-[#140c1c]",
  },
] as const;

function RememberBox({ title, text }: { title: string; text: string }) {
  return (
    <aside className="rounded-2xl border border-leanme-fuchsia/45 bg-black/40 px-5 py-5 md:px-6">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff8ac4]">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-leanme-fuchsia/40 bg-leanme-fuchsia/10">
          <TopicIcon name="bookmark" className="h-4 w-4" />
        </span>
        {title}
      </p>
      <p className="mt-3 text-lg font-medium leading-snug text-white md:text-xl">
        {text}
      </p>
    </aside>
  );
}

function RiskCards() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {articleBody.risks.map((risk, index) => {
        const tone = riskTone[index % riskTone.length];
        const icon = riskIcons[risk.id] ?? "spark";
        return (
          <article
            key={risk.id}
            className={`rounded-2xl border p-5 md:p-6 ${tone.card}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-black/30 ${tone.card} ${tone.kicker}`}
              >
                <TopicIcon name={icon} className="h-5 w-5" />
              </span>
              <div>
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.14em] ${tone.kicker}`}
                >
                  {risk.kicker}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-white">
                  {risk.heading}
                </h3>
              </div>
            </div>
            <p className={`mt-4 ${prose}`}>{risk.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function WorkExampleCards() {
  return (
    <div className="mt-6 space-y-5">
      {articleBody.workExamples.map((example, index) => {
        const tone = workTone[index % workTone.length];
        const icon = workIcons[example.id] ?? "gears";
        return (
          <article
            key={example.id}
            id={example.id}
            className={`scroll-mt-28 rounded-2xl border p-5 md:p-7 ${tone.card}`}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <span
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-black/30 ${tone.card} ${tone.kicker}`}
              >
                <TopicIcon name={icon} className="h-6 w-6" />
              </span>
              <div>
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.14em] ${tone.kicker}`}
                >
                  {example.kicker}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-white md:text-2xl">
                  {example.heading}
                </h3>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <p className={prose}>
                <strong
                  className={`mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${tone.kicker} bg-black/30`}
                >
                  Situazione
                </strong>
                <span className="block">{example.situation}</span>
              </p>
              <p
                className={`${prose} rounded-r-xl border-l-2 px-4 py-3 text-white ${tone.label}`}
              >
                <strong className="font-semibold">Cosa può essere rilevante: </strong>
                {example.relevance}
              </p>
              <p className={prose}>
                <strong className="font-semibold text-white">
                  Cosa valutare:{" "}
                </strong>
                {example.evaluate}
              </p>
            </div>
          </article>
        );
      })}
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
          return (
            <p key={`${block.text.slice(0, 28)}-${index}`} className={prose}>
              {block.text}
            </p>
          );
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

        if (block.type === "remember") {
          return (
            <RememberBox
              key={`${block.title}-${index}`}
              title={block.title}
              text={block.text}
            />
          );
        }

        if (block.type === "risks") {
          return <RiskCards key="risks" />;
        }

        if (block.type === "work-examples") {
          return <WorkExampleCards key="work-examples" />;
        }

        if (block.type === "ul") {
          return (
            <ul
              key={`ul-${index}`}
              className="list-disc space-y-2 pl-5 text-base leading-relaxed text-white/85 md:text-[1.0625rem] md:leading-8"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        const chip =
          listTone === "fuchsia"
            ? "border-leanme-fuchsia/40 bg-black/35"
            : "border-[#3ec6ff]/35 bg-black/30";
        const numeral =
          listTone === "fuchsia" ? "text-[#ff8ac4]" : "text-[#8adfff]";

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
      })}
    </div>
  );
}

function VideoPreview({ videoCta }: { videoCta?: LeanLabArticleCta }) {
  const href = videoCta?.href ?? ACADEMY_HREF;

  return (
    <section
      aria-labelledby="ai-act-video-preview"
      className="mt-10 overflow-hidden rounded-2xl border border-leanme-fuchsia/40 bg-[#14040c]"
    >
      <Link
        href={href}
        className="group relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leanme-fuchsia"
        aria-label="Guarda il video gratuito su LeanAcademy"
      >
        <div className="relative aspect-video">
          <Image
            src={COVER}
            alt="Luana.AI nella sede LeanMe Open Innovation Hub: anteprima del video sull'AI Act."
            fill
            className="object-cover object-[center_25%] transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 720px"
            priority
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-leanme-fuchsia text-white shadow-[0_0_0_10px_rgba(230,0,126,0.2)] transition group-hover:scale-105 md:h-20 md:w-20">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </span>
        </div>
        <div className="relative px-5 py-6 md:px-8 md:py-7">
          <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            <span>Te lo spiego io — con Luana.AI</span>
            <span className={categoryBadgeClass("ricerca-e-innovazione")}>
              Ricerca & Innovazione
            </span>
          </p>
          <h2
            id="ai-act-video-preview"
            className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white md:text-3xl"
          >
            AI Act: le nuove regole spiegate semplice.
          </h2>
          <p className={`mt-3 max-w-2xl ${prose}`}>
            In pochi minuti Luana.AI ti racconta cos&apos;è l&apos;AI Act e perché
            riguarda anche chi utilizza l&apos;intelligenza artificiale nel lavoro
            quotidiano.
          </p>
          <span className="mt-6 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition group-hover:brightness-110">
            Guarda il video gratuito su LeanAcademy →
          </span>
        </div>
      </Link>
    </section>
  );
}

function AcademyBanner() {
  return (
    <aside className="mt-10 rounded-2xl border border-white/12 bg-[#0f0f12] px-5 py-6 md:px-7 md:py-7">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#3ec6ff]/35 bg-[#04141c]">
          <TopicIcon name="academy" className="h-4 w-4" />
        </span>
        Presto nuovi corsi su LeanAcademy
      </p>
      <p className={`mt-3 ${prose}`}>
        Continua a seguirci! Stiamo preparando nuovi percorsi dedicati
        all&apos;intelligenza artificiale, alle sue applicazioni pratiche e alle
        competenze digitali.
      </p>
      <Link
        href="/lean-academy"
        className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.08em] text-leanme-fuchsia transition hover:text-white"
      >
        Vai a Lean Academy →
      </Link>
    </aside>
  );
}

/**
 * Articolo editoriale «AI Act: le nuove regole…» — Te lo spiego io, con Luana.AI.
 * L'anteprima apre la puntata in Lean Academy.
 */
export function AiActRegoleIntelligenzaArtificiale({
  videoCta,
}: {
  videoCta?: LeanLabArticleCta;
}) {
  const tags =
    getLeanLabArticle("ai-act-regole-intelligenza-artificiale")?.tags ?? [];

  return (
    <article className="max-w-4xl">
      <figure className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
        <Image
          src={COVER}
          alt="Luana.AI nella sede LeanMe Open Innovation Hub: cover dell'articolo sull'AI Act."
          fill
          priority
          className="object-cover object-[center_25%]"
          sizes="(max-width: 1024px) 100vw, 720px"
        />
      </figure>

      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
        {articleBody.series}
      </p>
      <h2 className="mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
        {articleBody.introTitle}
      </h2>
      <div className="mt-6 space-y-4">
        {articleBody.intro.map((paragraph, index) =>
          index === 0 ? (
            <p
              key={paragraph}
              className="text-xl font-medium leading-snug text-white md:text-2xl"
            >
              {paragraph}
            </p>
          ) : (
            <p key={paragraph} className={prose}>
              {paragraph}
            </p>
          )
        )}
      </div>

      <VideoPreview videoCta={videoCta} />

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
              listTone={
                section.id === "da-dove-cominciare" || section.id === "ai-literacy"
                  ? "fuchsia"
                  : "cyan"
              }
            />
          </section>
        ))}
      </div>

      <section
        aria-labelledby="ai-act-sources"
        className="mt-10 rounded-2xl border border-white/12 bg-[#0c0c0c] px-5 py-6 md:px-7"
      >
        <h2
          id="ai-act-sources"
          className="text-xl font-semibold text-white md:text-2xl"
        >
          Fonti e approfondimenti
        </h2>
        <p className={`mt-4 ${prose}`}>{articleBody.timelineNote}</p>
        <ul className="mt-5 space-y-3">
          {articleBody.sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#8adfff] underline-offset-4 transition hover:text-white hover:underline md:text-base"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <AcademyBanner />

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

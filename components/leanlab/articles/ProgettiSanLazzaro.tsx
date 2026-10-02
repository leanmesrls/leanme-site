"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ASSET = "/assets/leanlab/progetti-san-lazzaro";

const PEOPLE = [
  {
    name: "Marconi",
    role: "Marketing e comunicazione",
    src: "/assets/official/agenti-schede/marconi-portrait.jpg",
    alt: "Lean.Agent Marconi",
  },
  {
    name: "Olivetti",
    role: "IT e sviluppo",
    src: "/assets/official/agenti-schede/olivetti-portrait.jpg",
    alt: "Lean.Agent Olivetti",
  },
  {
    name: "Galileo",
    role: "Workflow e dati",
    src: "/assets/official/agenti-schede/galileo-portrait.jpg",
    alt: "Lean.Agent Galileo",
  },
  {
    name: "Pizzano",
    role: "Centri medici",
    src: `${ASSET}/antonio.png`,
    alt: "Antonio Pizzano",
    href: "https://www.antoniopizzano.it/",
    crop: true,
  },
] as const;

function Portrait({
  src,
  alt,
  crop,
}: {
  src: string;
  alt: string;
  crop?: boolean;
}) {
  if (crop) {
    return (
      <span className="block h-[72px] w-[58px] overflow-hidden rounded-md bg-black">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-[center_18%]"
        />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-[72px] w-[58px] rounded-md object-cover object-top"
    />
  );
}

function BeforeAfter() {
  const [position, setPosition] = useState(46);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (reduced) {
    return (
      <div className="grid gap-3">
        <figure>
          <img
            src={`${ASSET}/prima.jpg`}
            alt="Prima: homepage precedente, interno della palestra."
            className="w-full rounded-xl object-cover object-top"
          />
          <figcaption className="mt-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#c4b5fd]">
            Prima
          </figcaption>
        </figure>
        <figure>
          <img
            src={`${ASSET}/dopo.jpg`}
            alt="Dopo: homepage nuova, edificio su strada."
            className="w-full rounded-xl object-cover object-top"
          />
          <figcaption className="mt-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#c4b5fd]">
            Dopo
          </figcaption>
        </figure>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[1024/594] overflow-hidden rounded-xl bg-black">
        <img
          src={`${ASSET}/dopo.jpg`}
          alt="Dopo: homepage nuova, edificio su strada."
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={`${ASSET}/prima.jpg`}
            alt="Prima: homepage precedente, interno della palestra."
            className="absolute inset-y-0 left-0 h-full max-w-none object-cover object-top"
            style={{ width: `${10000 / position}%` }}
          />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white">
          Prima
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white">
          Dopo
        </span>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-[#7c4dff]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7c4dff] text-sm font-bold text-white">
            ↔
          </span>
        </div>
        <input
          type="range"
          min={8}
          max={92}
          value={position}
          aria-label="Confronto tra homepage precedente e homepage nuova"
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="mt-2 text-center text-xs text-white/50">
        Prima ← trascina la barra → Dopo
      </p>
    </div>
  );
}

const CARDS = [
  {
    who: "Marconi · Marketing e comunicazione",
    title: "Farsi trovare. E portare le persone nel posto giusto.",
    body: "Marconi ci ha aiutato a progettare il sito anche come strumento di visibilità, acquisizione e conversione: contenuti, SEO, GEO, campagne e percorsi capaci di accompagnare ogni utente verso la risposta giusta.",
    chips: ["SEO", "GEO", "ADV", "Contenuti", "Conversioni"],
    src: "/assets/official/agenti-schede/marconi-portrait.jpg",
  },
  {
    who: "Olivetti · IT e sviluppo",
    title: "Cambiare tutto. Senza perdere ciò che Google conosceva già.",
    body: "Con Olivetti abbiamo riprogettato struttura e tecnologia preservando il patrimonio digitale esistente: URL strategici, redirect, architettura, performance e possibilità di evoluzione.",
    chips: ["URL", "Redirect", "Architettura", "Performance", "Sviluppo"],
    src: "/assets/official/agenti-schede/olivetti-portrait.jpg",
  },
  {
    who: "Galileo · Workflow e dati",
    title: "Non solo raccogliere un dato. Farlo continuare nel suo percorso.",
    body: "Galileo ci ha aiutato a pensare il sito come parte di un flusso: tracciare le interazioni, raccogliere i dati e predisporli per workflow, recall, misurazione e attività successive.",
    chips: ["Tracking", "Database", "Workflow", "Recall", "Misurazione"],
    src: "/assets/official/agenti-schede/galileo-portrait.jpg",
  },
  {
    who: "Antonio Pizzano · Centri medici",
    href: "https://www.antoniopizzano.it/",
    title: "Partire dalle esigenze reali del centro.",
    body: "Antonio Pizzano ha portato nel progetto la conoscenza concreta dell’organizzazione di un centro medico: prestazioni, professionisti, agende, prenotazioni e pazienti. Il sito deve rappresentare e supportare ciò che il centro fa ogni giorno.",
    chips: ["Prestazioni", "Professionisti", "Agende", "Prenotazioni", "Pazienti"],
    src: `${ASSET}/antonio.png`,
    crop: true,
  },
] as const;

const STEPS = [
  "Analisi",
  "Organizzazione",
  "Architettura",
  "Sviluppo",
  "Verifica",
  "Evoluzione",
];

const NUMBERS = [
  { value: "30 → 103", label: "URL in sitemap" },
  { value: "16", label: "specialità" },
  { value: "45", label: "prestazioni autonome" },
  { value: "32", label: "schede professionisti" },
  { value: "102", label: "voci in ricerca interna" },
];

export function ProgettiSanLazzaro() {
  return (
    <article>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c4b5fd]">
        Progetti · Behind the Lab
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
        Quattro competenze. Un solo progetto.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
        Per il rifacimento del sito del Poliambulatorio Privato San Lazzaro
        abbiamo fatto entrare quattro prospettive complementari. LeanMe le ha
        fatte lavorare insieme.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PEOPLE.map((person) => (
          <figure key={person.name} className="text-sm">
            <Portrait src={person.src} alt={person.alt} crop={"crop" in person} />
            <figcaption className="mt-2 font-semibold text-white">
              {"href" in person ? (
                <a
                  href={person.href}
                  className="underline-offset-4 hover:underline"
                >
                  {person.name}
                </a>
              ) : (
                person.name
              )}
              <span className="mt-0.5 block text-xs font-medium text-white/50">
                {person.role}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {CARDS.map((card) => (
          <section
            key={card.title}
            className="grid gap-4 rounded-2xl bg-[#222228] p-4 sm:grid-cols-[58px_minmax(0,1fr)] sm:p-5"
          >
            <Portrait src={card.src} alt="" crop={"crop" in card} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#c4b5fd]">
                {"href" in card ? (
                  <a href={card.href} className="hover:underline">
                    {card.who}
                  </a>
                ) : (
                  card.who
                )}
              </p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white md:text-xl">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{card.body}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {card.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/80"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section
        aria-label="La regia LeanMe"
        className="mt-8 rounded-2xl border border-[#7c4dff]/50 bg-[#121218] p-5 md:p-7"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c4b5fd]">
          La regia LeanMe
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Dietro le quinte, una regia unica.
        </h2>
        <div className="mt-6 flex flex-col items-stretch gap-2 md:flex-row md:items-stretch md:gap-3">
          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/15 px-4 py-5 text-center">
            <p className="text-sm font-semibold text-white/85">
              Il lavoro delle quattro competenze
            </p>
          </div>
          <div
            aria-hidden
            className="flex items-center justify-center text-xl font-bold text-[#7c4dff]"
          >
            <span className="md:hidden">↓</span>
            <span className="hidden md:inline">→</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#7c4dff] px-4 py-5 text-center text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              Regia
            </p>
            <p className="text-lg font-extrabold tracking-wide">LeanMe</p>
          </div>
          <div
            aria-hidden
            className="flex items-center justify-center text-xl font-bold text-[#7c4dff]"
          >
            <span className="md:hidden">↓</span>
            <span className="hidden md:inline">→</span>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl border border-[#7c4dff] px-4 py-5 text-center">
            <p className="text-sm font-semibold text-white">
              Un unico sistema digitale
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-[#1c1c22] p-5 md:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c4b5fd]">
          E l’AI?
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          È lo strumento che ha amplificato il processo.
        </h2>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-white md:text-base">
          Non è un quinto interlocutore, non è un reparto separato, non è chi ha
          deciso come costruire il sito. E non è neanche solo uno strumento di
          sviluppo.
        </p>
        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-bold uppercase tracking-[0.06em] text-white">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-[#7c4dff]/20 px-2.5 py-1">{step}</span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden className="text-[#7c4dff]">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          Abbiamo utilizzato l’AI per amplificare il lavoro delle competenze
          coinvolte, accelerando analisi e sviluppo senza sostituire la regia, le
          decisioni e la supervisione umana.
        </p>
        <p className="mt-4 text-sm font-semibold text-white">
          Powered by Human Intelligence. Amplified by AI.
        </p>
      </section>

      <section className="mt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c4b5fd]">
          Il caso
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Poliambulatorio Privato San Lazzaro
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
          L’evoluzione del sito, gestita dal team insieme ad Antonio Pizzano.
          Trascina la barra viola: a sinistra com’era, a destra com’è.
        </p>
        <div className="mt-5">
          <BeforeAfter />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {NUMBERS.map((item) => (
            <div key={item.label} className="rounded-xl bg-[#222228] px-3 py-3">
              <dt className="text-lg font-extrabold text-white">{item.value}</dt>
              <dd className="mt-1 text-xs text-white/60">{item.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-base leading-relaxed text-white/80">
          15 slug di specialità già noti a Google sono stati preservati, con i
          redirect a proteggere il resto. Canonical, NAP coerente e dati
          strutturati rendono il sito più comprensibile anche per i nuovi sistemi
          di ricerca.
        </p>
        <p className="mt-6">
          <Link
            href="/prenota-consulenza"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7c4dff] px-6 text-center text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c4dff]"
          >
            Ripensa il tuo sito. Contattaci
          </Link>
        </p>
      </section>
    </article>
  );
}

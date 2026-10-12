"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Asset in public/assets/leanlab/progetti-parole-che-curano/
 * Lasciare la stringa vuota finché il file non c'è: il layout resta pronto.
 */
const ASSET = "/assets/leanlab/progetti-parole-che-curano";
const HERO_SRC = `${ASSET}/sala.jpg`;
const REGIA_SRC = `${ASSET}/regia.jpg`;

const PARTNERS = [
  {
    name: "Officina del Paziente",
    role: "Organizzatore",
    href: "https://officinadelpaziente.it/",
    src: "",
  },
  {
    name: "Parole O_Stili",
    role: "Partner",
    href: "https://www.paroleostili.it/",
    src: "",
  },
] as const;

const SERVICES = [
  {
    title: "Sito web e iscrizioni",
    body: "Realizzazione del sito dedicato all'evento e gestione delle registrazioni dei partecipanti.",
    icon: "web",
  },
  {
    title: "Regia integrata",
    body: "Coordinamento tecnico della giornata, gestione della sala fisica e dello streaming.",
    icon: "regia",
  },
  {
    title: "Interazione ibrida",
    body: "Gestione della partecipazione e del confronto tra pubblico presente e collegato online.",
    icon: "talk",
  },
  {
    title: "Sale parallele",
    body: "Organizzazione dei lavori di gruppo in ambienti fisici e virtuali, con successiva restituzione in plenaria.",
    icon: "rooms",
  },
  {
    title: "Riprese e interviste 4K",
    body: "Riprese video della giornata e interviste ai protagonisti dell'iniziativa.",
    icon: "camera",
  },
  {
    title: "Video storytelling",
    body: "Produzione di un video emozionale attraverso montaggio e post-produzione del materiale audiovisivo.",
    icon: "film",
  },
] as const;

type ShotLayout = "wide" | "tall" | "square";

type Shot = {
  id: string;
  title: string;
  alt: string;
  layout: ShotLayout;
  src: string;
  tone: number;
  fit?: string;
  href?: string;
  bare?: boolean;
};

const SHOTS: Shot[] = [
  {
    id: "protagoniste",
    title: "Le protagoniste",
    alt: "Due protagoniste dell'iniziativa davanti allo schermo di Le parole che curano, con i loghi di Officina del Paziente e Parole O_Stili.",
    layout: "tall",
    src: `${ASSET}/protagoniste.jpg`,
    tone: 0,
  },
  {
    id: "relatori",
    title: "In plenaria",
    alt: "Relatrice con microfono durante la plenaria, accanto a una partecipante seduta.",
    layout: "tall",
    src: `${ASSET}/relatrice.jpg`,
    tone: 1,
  },
  {
    id: "dialogo",
    title: "Il dialogo",
    alt: "Due relatrici in dialogo nella sala, una in piedi con il microfono e una seduta in poltrona.",
    layout: "tall",
    src: `${ASSET}/dialogo.jpg`,
    tone: 2,
  },
  {
    id: "tavoli",
    title: "I tavoli",
    alt: "Partecipanti ai tavoli durante il confronto, con lo schermo della sessione e una relatrice in piedi.",
    layout: "tall",
    src: `${ASSET}/tavoli.jpg`,
    tone: 3,
  },
  {
    id: "tutti",
    title: "Tutti e tutte",
    alt: "Slide della giornata, Tutti e tutte, con il marchio Parole O_Stili e la sala in collegamento.",
    layout: "wide",
    src: `${ASSET}/slide-tutti.jpg`,
    tone: 4,
  },
  {
    id: "stereotipi",
    title: "Le parole e i pregiudizi",
    alt: "Slide su stereotipo, pregiudizio e discriminazione, proiettata durante la plenaria.",
    layout: "wide",
    src: `${ASSET}/slide-stereotipi.jpg`,
    tone: 5,
  },
  {
    id: "icare",
    title: "I care",
    alt: "Slide I care, con il testo scritto a mano mostrato durante l'incontro.",
    layout: "wide",
    src: `${ASSET}/slide-icare.jpg`,
    tone: 2,
  },
  {
    id: "media",
    title: "Chi ascolta",
    alt: "Slide sul consumo dei media tra generazioni, mostrata durante la giornata.",
    layout: "wide",
    src: `${ASSET}/slide-media.jpg`,
    tone: 1,
  },
  {
    id: "parole",
    title: "Scegliete parole",
    alt: "Slide della giornata: scegliete parole che vi assomigliano, cercate la persona oltre la malattia e lasciate spazio all'ascolto.",
    layout: "wide",
    src: `${ASSET}/slide-parole.jpg`,
    tone: 4,
    fit: "object-contain",
  },
  {
    id: "puntino",
    title: "Questo puntino sei tu",
    alt: "Slide di Parole O_Stili: questo puntino sei tu, con la tua rete e la famiglia che hai costruito, perché nelle relazioni batte il cuore di tutto.",
    layout: "wide",
    src: `${ASSET}/slide-puntino.jpg`,
    tone: 5,
    fit: "object-contain",
  },
  {
    id: "maya",
    title: "Come li hai fatte sentire",
    alt: "Slide con il ritratto di Maya Angelou e la frase: la gente dimenticherà ciò che hai detto e ciò che hai fatto, ma non come li hai fatte sentire.",
    layout: "wide",
    src: `${ASSET}/slide-maya.jpg`,
    tone: 2,
    fit: "object-contain",
  },
  {
    id: "manifesto",
    title: "Il Manifesto",
    alt: "Il Manifesto della comunicazione non ostile di Parole O_Stili, dieci principi su sfondo giallo.",
    layout: "wide",
    src: `${ASSET}/manifesto.jpg`,
    tone: 4,
    fit: "object-contain",
    href: "https://www.paroleostili.it/",
    bare: true,
  },
  {
    id: "regia-foto",
    title: "La regia",
    alt: "Postazione di regia LeanMe: monitor con la regia, mixer audio, telecamera e rack.",
    layout: "wide",
    src: `${ASSET}/regia.jpg`,
    tone: 6,
  },
  {
    id: "camere",
    title: "La telecamera",
    alt: "Telecamera sulla postazione di regia, accanto a tastiera e cavi.",
    layout: "wide",
    src: `${ASSET}/regia-camera.jpg`,
    tone: 7,
  },
  {
    id: "audio-foto",
    title: "Audio e rack",
    alt: "Mixer audio e rack della regia LeanMe durante l'evento.",
    layout: "wide",
    src: `${ASSET}/regia-audio.jpg`,
    tone: 8,
  },
];

const TONES = [
  "bg-[radial-gradient(circle_at_20%_20%,#5b3fd6_0%,#140818_52%,#050308_100%)]",
  "bg-[radial-gradient(circle_at_70%_15%,#e6007e_0%,#1a0a14_46%,#07040a_100%)]",
  "bg-[linear-gradient(160deg,#2a1848_0%,#0c0614_55%,#000_100%)]",
  "bg-[radial-gradient(circle_at_40%_80%,#7c4dff_0%,#120814_50%,#000_100%)]",
  "bg-[linear-gradient(200deg,#3a1030_0%,#120810_60%,#050308_100%)]",
  "bg-[radial-gradient(circle_at_80%_70%,#c4b5fd_0%,#24143a_40%,#07040c_100%)]",
  "bg-[linear-gradient(120deg,#101018_0%,#2a1230_45%,#07040a_100%)]",
  "bg-[radial-gradient(circle_at_30%_60%,#e6007e_0%,#180814_48%,#000_100%)]",
  "bg-[linear-gradient(180deg,#1a1030_0%,#0a0612_100%)]",
];

const LAYOUT_CLASS: Record<ShotLayout, string> = {
  wide: "aspect-[16/10]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
};

function EditorialFigure({
  src,
  alt,
  caption,
  href,
}: {
  src: string;
  alt: string;
  caption: string;
  href?: string;
}) {
  const image = <img src={src} alt={alt} className="h-auto w-full rounded-2xl" />;
  return (
    <figure>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          {image}
        </a>
      ) : (
        image
      )}
      <figcaption className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60">
        {caption}
      </figcaption>
    </figure>
  );
}

function Kicker({ children, onLight = false }: { children: string; onLight?: boolean }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
        onLight ? "text-[#7a1b8a]" : "text-[#c4b5fd]"
      }`}
    >
      {children}
    </p>
  );
}

function Icon({ name }: { name: (typeof SERVICES)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "web":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c2.4 2.6 2.4 13.4 0 16M12 4c-2.4 2.6-2.4 13.4 0 16" />
        </svg>
      );
    case "regia":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="10" rx="2" />
          <path d="M8 8V6M16 8V6M7 13h4M14 13h3" />
        </svg>
      );
    case "talk":
      return (
        <svg {...common}>
          <path d="M5 16.5V7.5A2.5 2.5 0 0 1 7.5 5h6A2.5 2.5 0 0 1 16 7.5V12a2.5 2.5 0 0 1-2.5 2.5H9L5 18v-1.5Z" />
          <path d="M16 9.5h.5A2.5 2.5 0 0 1 19 12v2.2L16.8 16" />
        </svg>
      );
    case "rooms":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="7" height="7" rx="1.4" />
          <rect x="14" y="4" width="7" height="7" rx="1.4" />
          <rect x="8.5" y="13" width="7" height="7" rx="1.4" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h10v9H4z" />
          <path d="M14 11.5 20 8.5v8l-6-3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m10 9 5 3-5 3V9Z" />
        </svg>
      );
  }
}

function Frame({
  src,
  alt,
  tone,
  className,
  imgClassName = "object-cover",
  bare = false,
  children,
}: {
  src: string;
  alt: string;
  tone: number;
  className?: string;
  imgClassName?: string;
  bare?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-black ${className ?? ""}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${imgClassName}`}
        />
      ) : (
        <span aria-hidden className={`absolute inset-0 ${TONES[tone] ?? TONES[0]}`} />
      )}
      {bare ? null : (
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.28)_100%)]"
        />
      )}
      {children}
    </div>
  );
}

function HybridFlow() {
  return (
    <div className="mt-8" aria-hidden={false}>
      <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd]">
          Partenza condivisa
        </p>
        <p className="mt-1 text-lg font-extrabold text-white">Plenaria</p>
      </div>
      <p aria-hidden className="py-2 text-center text-xl font-bold text-leanme-fuchsia">
        ↓
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#7c4dff]/50 bg-[#140c22] px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd]">
            Percorso fisico
          </p>
          <p className="mt-2 text-base font-extrabold text-white">Gruppi in sala</p>
          <p className="mt-1 text-sm text-white/65">Confronto ai tavoli, con un referente.</p>
        </div>
        <div className="rounded-2xl border border-leanme-fuchsia/50 bg-[#1a0a14] px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Percorso digitale
          </p>
          <p className="mt-2 text-base font-extrabold text-white">Gruppi online</p>
          <p className="mt-1 text-sm text-white/65">Sale virtuali, nello stesso momento.</p>
        </div>
      </div>
      <p aria-hidden className="py-2 text-center text-xl font-bold text-leanme-fuchsia">
        ↓
      </p>
      <div className="rounded-2xl bg-leanme-fuchsia px-4 py-5 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
          I due percorsi si riuniscono
        </p>
        <p className="mt-1 text-lg font-extrabold">Restituzione in plenaria</p>
      </div>
      <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
        {["Plenaria", "Gruppi di lavoro", "Confronto", "Restituzione in plenaria"].map(
          (step, index, list) => (
            <li key={step} className="flex items-center gap-2">
              <span>{step}</span>
              {index < list.length - 1 ? (
                <span aria-hidden className="text-leanme-fuchsia">
                  →
                </span>
              ) : null}
            </li>
          )
        )}
      </ol>
    </div>
  );
}

function RegiaDesk() {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
      <img
        src={REGIA_SRC}
        alt="Panoramica della regia LeanMe durante Le parole che curano."
        className="aspect-video w-full object-cover object-center"
      />
    </div>
  );
}

function PhotoStory() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const shot = open ? SHOTS[index] : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") {
        setIndex((current) =>
          current === null ? current : (current + 1) % SHOTS.length
        );
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) =>
          current === null ? current : (current - 1 + SHOTS.length) % SHOTS.length
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, index]);

  return (
    <section className="scroll-mt-28" aria-labelledby="photo-story-title">
      <Kicker>Photo story</Kicker>
      <h2
        id="photo-story-title"
        className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl"
      >
        Le parole, le persone, le connessioni.
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
        Immagini, slide e momenti della giornata.
      </p>
      <div className="mt-8 columns-1 gap-3 sm:columns-2 lg:columns-3">
        {SHOTS.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
            onClick={() => setIndex(itemIndex)}
            aria-label={`Apri ${item.title}. ${item.alt}`}
          >
            <Frame
              src={item.src}
              alt=""
              tone={item.tone}
              className={LAYOUT_CLASS[item.layout]}
              imgClassName={item.fit}
              bare={item.bare}
            >
              {item.bare ? null : (
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-lg font-extrabold text-white">{item.title}</span>
                </span>
              )}
            </Frame>
          </button>
        ))}
      </div>

      {shot ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={shot.title}
          tabIndex={-1}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 p-4 outline-none md:p-10"
          onClick={() => setIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Frame
              src={shot.src}
              alt={shot.alt}
              tone={shot.tone}
              className="aspect-[16/10] rounded-2xl"
              imgClassName={shot.fit}
              bare={shot.bare}
            >
              {!shot.src ? (
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Fotografia in arrivo
                </span>
              ) : null}
            </Frame>
            <p className="mt-3 text-sm text-white/80">{shot.alt}</p>
            {shot.href ? (
              <a
                href={shot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-leanme-fuchsia underline-offset-4 hover:underline"
              >
                paroleostili.it
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-leanme-fuchsia"
                onClick={() =>
                  setIndex((current) =>
                    current === null ? current : (current - 1 + SHOTS.length) % SHOTS.length
                  )
                }
              >
                ← Precedente
              </button>
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                onClick={() => setIndex(null)}
              >
                Chiudi
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-leanme-fuchsia"
                onClick={() =>
                  setIndex((current) =>
                    current === null ? current : (current + 1) % SHOTS.length
                  )
                }
              >
                Successiva →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function VideoSlot() {
  const [open, setOpen] = useState(false);

  return (
    <section id="video" className="scroll-mt-28" aria-labelledby="video-title">
      <Kicker>Video</Kicker>
      <h2
        id="video-title"
        className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl"
      >
        Le parole che curano. Il racconto continua.
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
        Un video per rivivere i momenti più significativi della giornata, attraverso
        immagini, testimonianze e riflessioni dei protagonisti.
      </p>
      <button
        type="button"
        className="relative mt-6 block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#3a1848_0%,#07040c_68%)]"
        />
        <span className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leanme-fuchsia text-white shadow-[0_0_32px_rgba(230,0,126,0.45)]">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
            <span className="sr-only">{open ? "Nascondi il messaggio" : "Play"}</span>
          </span>
          {open ? (
            <span className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-white">
              Il video emozionale è in montaggio. Quando sarà pronto, lo incorporeremo
              in questa anteprima.
            </span>
          ) : (
            <span className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
              Anteprima 16:9
            </span>
          )}
        </span>
      </button>
      <p className="mt-3 text-sm text-white/60">
        Riprese e interviste in 4K · Montaggio · Post-produzione
      </p>
    </section>
  );
}

export function ProgettiParoleCheCurano() {
  return (
    <article className="space-y-16 md:space-y-20">
      <section aria-label="Il progetto in primo piano">
        <Frame
          src={HERO_SRC}
          alt="Sala durante Le parole che curano a Roma: platea ai tavoli, schermo e relatrice con microfono."
          tone={0}
          imgClassName="object-cover object-[center_40%]"
          className="min-h-[560px] rounded-3xl md:min-h-[640px]"
        >
          <div className="relative flex min-h-[560px] flex-col justify-between p-6 md:min-h-[640px] md:p-10">
            <p className="inline-flex w-fit rounded-full bg-[#0c0614]/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd] ring-1 ring-[#7c4dff]/80">
              Progetti / Behind the Lab / Ep. 02
            </p>
            <div className="max-w-3xl">
              <p className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
                Le parole che curano.
                <span className="mt-2 block">La tecnologia che dà voce alle persone.</span>
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
                Come abbiamo trasformato un evento ibrido in un&apos;esperienza di ascolto,
                confronto e partecipazione, attraverso una regia integrata, sale parallele
                fisiche e virtuali e strumenti digitali progettati per connettere le persone.
              </p>
              <p className="mt-4 text-sm font-semibold text-white">Roma · 10 ottobre 2026</p>
              <ul className="mt-6 flex flex-col gap-3 sm:flex-row">
                {PARTNERS.map((partner) => (
                  <li key={partner.name}>
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-sm transition hover:border-[#c4b5fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4b5fd]"
                    >
                      {partner.src ? (
                        <img src={partner.src} alt="" className="h-8 w-auto" />
                      ) : null}
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd]">
                          {partner.role}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-leanme-fuchsia">
                          {partner.name}
                          <span aria-hidden="true">→</span>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Frame>
      </section>

      <section aria-labelledby="progetto-title">
        <Kicker>Il progetto</Kicker>
        <h2
          id="progetto-title"
          className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl"
        >
          Prima le persone, poi la tecnologia.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Frame
            src={`${ASSET}/protagoniste.jpg`}
            alt="Le due speaker di Le parole che curano, abbracciate davanti allo schermo dell'evento."
            tone={1}
            imgClassName="object-cover object-[center_36%]"
            className="aspect-[4/3] rounded-2xl"
          >
            <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-extrabold text-white">
              La plenaria
            </span>
          </Frame>
          <Frame
            src={`${ASSET}/tavoli.jpg`}
            alt="Partecipanti ai tavoli durante i lavori di gruppo."
            tone={3}
            imgClassName="object-cover object-[center_42%]"
            className="aspect-[4/3] rounded-2xl"
          >
            <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-extrabold text-white">
              I lavori di gruppo
            </span>
          </Frame>
        </div>
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-white/75 md:text-base">
          <p>Le parole possono ferire. Ma possono anche curare.</p>
          <p>
            Il linguaggio influenza le relazioni, costruisce percezioni e può contribuire
            a creare o abbattere barriere.
          </p>
          <p>
            Da questa consapevolezza nasce Le parole che curano, una giornata partecipativa
            dedicata a pazienti, caregiver e associazioni, per riflettere sul rapporto tra
            comunicazione, stigma e inclusione.
          </p>
          <p>
            Un&apos;occasione per riconoscere le parole che feriscono e costruire insieme un
            linguaggio più consapevole, rispettoso e capace di favorire il dialogo tra
            pazienti, professionisti sanitari e associazioni.
          </p>
        </div>
        <div className="mt-8">
          <EditorialFigure
            src={`${ASSET}/etichette.jpg`}
            alt="Quattro ritratti. Ogni persona tiene un foglio con un codice a barre e un'etichetta: Superficiale, Criminale, Una facile, Sfigato."
            caption="Le etichette che il linguaggio appiccica alle persone, prima ancora di incontrarle."
          />
        </div>
        <div className="mt-8 grid items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <blockquote className="border-l-4 border-[#7c4dff] pl-5">
            <p className="text-2xl font-extrabold leading-snug tracking-tight text-white md:text-3xl">
              Le parole al centro della comunicazione. Le persone al centro
              dell&apos;esperienza.
            </p>
          </blockquote>
          <EditorialFigure
            src={`${ASSET}/microaggressioni.jpg`}
            alt="Due schede affiancate. Gli insulti: un'espressione irrispettosa, sprezzante, umiliante o degradante. Le microaggressioni: un atto in apparenza non eclatante, che può rivelare una mentalità discriminatoria, volontaria o involontaria."
            caption="Un insulto si riconosce. Una microaggressione, molto meno."
          />
        </div>
      </section>

      <section aria-labelledby="sfida-title" className="rounded-3xl border border-white/10 bg-[#222228] p-5 md:p-8">
        <Kicker>La sfida</Kicker>
        <h2
          id="sfida-title"
          className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl"
        >
          Non bastava trasmettere l&apos;evento.
        </h2>
        <p className="mt-4 text-lg font-semibold text-white">
          Come rendere davvero partecipativo un evento ibrido?
        </p>
        <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-white/75 md:text-base">
          <p>
            La sfida non era semplicemente collegare una sala a una piattaforma di
            streaming. Era costruire un&apos;esperienza in cui i partecipanti, indipendentemente
            dalla loro presenza fisica o digitale, potessero ascoltare, confrontarsi,
            lavorare in gruppo e condividere il risultato delle proprie riflessioni.
          </p>
          <p>Per farlo serviva un sistema capace di coordinare diversi ambienti e momenti della giornata.</p>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[
            "Una sessione plenaria condivisa.",
            "Gruppi di lavoro in sale fisiche e virtuali.",
            "Un referente per ciascun gruppo incaricato di riportare le riflessioni in plenaria.",
            "Una regia tecnica in grado di coordinare le diverse attività.",
            "Una produzione audiovisiva per documentare e valorizzare l'esperienza.",
          ].map((item) => (
            <li key={item} className="rounded-xl border border-white/10 px-3 py-3 text-sm text-white/80">
              {item}
            </li>
          ))}
        </ul>
        <HybridFlow />
      </section>

      <section className="rounded-3xl bg-[#f4efff] px-6 py-12 text-[#1c1230] md:px-10 md:py-16">
        <Kicker onLight>Il valore del progetto</Kicker>
        <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          La tecnologia non sostituisce le relazioni.
          <span className="mt-2 block">Le rende possibili, anche a distanza.</span>
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-[#1c1230]/80 md:text-base">
          <p>Un evento ibrido non è soltanto un evento trasmesso online.</p>
          <p>
            È un&apos;esperienza progettata per permettere alle persone di partecipare,
            condividere idee e costruire qualcosa insieme.
          </p>
          <p>
            Per LeanMe, innovare significa proprio questo: mettere strumenti, competenze e
            tecnologia al servizio delle persone.
          </p>
        </div>
        <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.08em] text-leanme-fuchsia">
          Powered by Human Intelligence. Amplified by AI.
        </p>
      </section>

      <section
        aria-labelledby="soluzione-title"
        className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#222228] p-5 md:p-8"
      >
        <Kicker>La soluzione LeanMe</Kicker>
        <h2
          id="soluzione-title"
          className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl"
        >
          Un unico progetto, tante competenze.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
          Dall&apos;iscrizione all&apos;ultimo ciak, LeanMe ha tenuto insieme strumenti
          digitali, regia tecnica e produzione audiovisiva.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.title} className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/40 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leanme-fuchsia/15 text-leanme-fuchsia">
                <Icon name={service.icon} />
              </span>
              <span className="mt-4 text-lg font-extrabold tracking-tight text-white">
                {service.title}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
                {service.body}
              </span>
            </li>
          ))}
        </ul>

        <div id="regia" className="scroll-mt-28">
          <RegiaDesk />
        </div>
      </section>

      <PhotoStory />
      <VideoSlot />

      <section className="rounded-3xl border border-leanme-fuchsia/50 bg-black px-6 py-12 md:px-10 md:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leanme-fuchsia">
          Il prossimo evento
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          Non solo streaming.
          <span className="mt-2 block text-leanme-fuchsia">Progettiamo partecipazione.</span>
        </h2>
        <div className="mt-5 max-w-2xl space-y-3 text-sm leading-relaxed text-white/75 md:text-base">
          <p>
            Eventi ibridi, congressi scientifici, workshop interattivi, sale parallele,
            regia integrata e produzione audiovisiva.
          </p>
          <p>
            Dalla progettazione digitale alla gestione tecnica, LeanMe ti accompagna in
            ogni fase.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/prenota-consulenza"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Parliamo del tuo evento →
          </Link>
          <Link
            href="/come-possiamo-aiutarti/partner-eventi"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-leanme-fuchsia px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            Scopri LeanMe per gli eventi →
          </Link>
        </div>
      </section>
    </article>
  );
}

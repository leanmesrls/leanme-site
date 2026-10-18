import Link from "next/link";

import { AcademyVideoPlayer } from "@/components/academy/AcademyVideoPlayer";
import { ASSETS } from "@/lib/assets";

const ANGELA = "/assets/official/agenti-schede/angela-portrait.jpg";

const QUOTE =
  "L'intelligenza artificiale amplifica la qualità delle nostre istruzioni, non sostituisce la nostra capacità di pensare.";

function AngelaFace({ className = "" }: { className?: string }) {
  return (
    <span className={`block overflow-hidden rounded-lg bg-black ${className}`}>
      <img
        src={ANGELA}
        alt=""
        className="h-full w-full object-cover object-top"
      />
    </span>
  );
}

function PromptBlock({
  label,
  children,
  tone,
}: {
  label: string;
  children: string;
  tone: "generic" | "better";
}) {
  const generic = tone === "generic";
  return (
    <div
      className={`rounded-2xl p-4 md:p-5 ${
        generic
          ? "border border-white/10 bg-black/40"
          : "border border-[#3ec6ff]/40 bg-[#041018]"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
          generic ? "text-white/45" : "text-[#8adfff]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 whitespace-pre-line text-sm leading-relaxed md:text-base ${
          generic ? "text-white/60" : "font-medium text-white"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function AngelaTip({ children }: { children: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#16161a] p-3">
      <AngelaFace className="h-14 w-12 shrink-0" />
      <p className="text-sm leading-relaxed text-white/85">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd]">
          Il consiglio di Angela
        </span>
        {children}
      </p>
    </div>
  );
}

export function NewsletterRicercaEpisodio02() {
  return (
    <article className="space-y-10 text-base leading-relaxed text-white/80 md:space-y-14 md:text-lg">
      <div className="max-w-3xl space-y-4">
        <p>
          Hai mai chiesto qualcosa a ChatGPT, Gemini o a un altro strumento di
          intelligenza artificiale e pensato: «Non è proprio quello che
          volevo!»?
        </p>
        <p>
          Magari hai provato a riformulare la domanda, aggiungere qualche
          dettaglio o ricominciare da capo. Eppure, il risultato continuava a
          non convincerti.
        </p>
        <p>
          Il problema potrebbe non essere l&apos;intelligenza artificiale, ma il
          modo in cui le stiamo comunicando quello che vogliamo ottenere.
        </p>
        <p>
          Un prompt, infatti, non è una formula magica. È un&apos;istruzione. E
          più impariamo a costruire istruzioni chiare, più aumentano le
          possibilità di ottenere risultati pertinenti e utili.
        </p>
        <p>La buona notizia? Non serve essere programmatori o esperti di tecnologia.</p>
        <p className="font-semibold text-white">
          Basta imparare a fare le domande giuste.
        </p>
      </div>

      <section className="rounded-3xl border border-[#3ec6ff]/30 bg-[#041018] p-5 md:p-7">
        <div className="flex gap-4">
          <AngelaFace className="h-24 w-20 shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
              Te lo spiego io, con Angela
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Tre piccoli trucchi per cambiare il modo in cui lavori con
              l&apos;intelligenza artificiale.
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl">
          In questa puntata di Te lo spiego io, Angela, agente AI e formatrice
          digitale di LeanMe, ci accompagna alla scoperta di tre tecniche
          semplici, ma spesso sottovalutate.
        </p>
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8adfff]">
            Video gratuito Lean Academy · 2 minuti e mezzo
          </p>
          <div className="mt-3">
            <AcademyVideoPlayer
              src={ASSETS.leanlab.newsletterRicercaEpisodio02Video}
              poster={ASSETS.leanlab.newsletterRicercaEpisodio02Cover}
              label="Te lo spiego io. Come scrivere prompt migliori, con Lean.Agent.Angela"
            />
          </div>
          <Link
            href="/lean-academy/ricerca-e-innovazione-episodio-02"
            className="mt-2 inline-flex text-sm font-semibold text-[#8adfff] underline-offset-4 hover:underline"
          >
            Apri la puntata in Lean Academy
          </Link>
        </div>
        <div className="mt-5">
          <a
            href="#lean-prompt-builder"
            className="inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
          >
            Scorri in fondo all&apos;articolo e potrai accedere alla versione
            beta del Lean Prompt Builder 1.0.
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          1 Non chiedere subito una risposta. Fatti fare le domande!
        </h2>
        <p className="max-w-3xl">
          Quando utilizziamo l&apos;intelligenza artificiale, tendiamo a
          formulare una richiesta e aspettare immediatamente una soluzione.
        </p>
        <p className="max-w-3xl">
          Ma siamo davvero sicuri di aver fornito tutte le informazioni
          necessarie?
        </p>
        <p className="max-w-3xl">Immagina di scrivere:</p>
        <PromptBlock label="Prompt generico" tone="generic">
          Organizzami un evento aziendale.
        </PromptBlock>
        <p className="max-w-3xl">
          L&apos;AI potrebbe proporti un programma, una location e alcune
          attività. Ma non conosce il tuo budget, il pubblico, gli obiettivi o
          il tipo di evento che hai in mente.
        </p>
        <p className="max-w-3xl font-semibold text-white">
          Proviamo a cambiare approccio.
        </p>
        <PromptBlock label="Prompt migliorato" tone="better">
          {`Devo organizzare un evento aziendale.
Prima di propormi una soluzione, fammi cinque domande per comprendere meglio gli obiettivi, il pubblico, il budget, le tempistiche e le necessità organizzative.`}
        </PromptBlock>
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Perché funziona?
          </p>
          <p className="mt-2">
            Invece di lasciare che l&apos;AI faccia supposizioni, le chiediamo
            di aiutarci a definire il problema.
          </p>
          <p className="mt-2">
            È un cambio di prospettiva importante: l&apos;intelligenza
            artificiale non serve soltanto a generare risposte, ma può aiutarci
            anche a mettere a fuoco le nostre idee.
          </p>
        </div>
        <AngelaTip>
          Quando non sai esattamente da dove cominciare, prova a chiedere
          all&apos;AI quali informazioni le servono per aiutarti meglio.
        </AngelaTip>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          2 Non accontentarti della prima risposta. Chiedi alternative!
        </h2>
        <p className="max-w-3xl">
          Una delle abitudini più diffuse è considerare la prima risposta
          dell&apos;AI come un risultato definitivo.
        </p>
        <p className="max-w-3xl">Ma perché fermarsi alla prima proposta?</p>
        <p className="max-w-3xl">
          Immagina di dover trovare un titolo per una newsletter.
        </p>
        <PromptBlock label="Prompt generico" tone="generic">
          Scrivimi un titolo per una newsletter sull&apos;intelligenza
          artificiale.
        </PromptBlock>
        <div className="max-w-3xl">
          <p>Otterrai probabilmente un titolo. Magari anche interessante.</p>
          <p className="mt-2">
            Ma non saprai quali altre possibilità avresti potuto esplorare.
          </p>
        </div>
        <PromptBlock label="Prompt migliorato" tone="better">
          {`Proponimi tre titoli per una newsletter dedicata all'intelligenza artificiale:
uno professionale e autorevole;
uno creativo e coinvolgente;
uno provocatorio, capace di incuriosire.
Per ciascuno, spiegami brevemente quale pubblico potrebbe attirare e quali sono i suoi punti di forza.`}
        </PromptBlock>
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Perché funziona?
          </p>
          <p className="mt-2">
            In questo modo non ottieni semplicemente un contenuto, ma diverse
            possibilità da confrontare.
          </p>
          <p className="mt-2">
            Puoi valutare, combinare e migliorare le proposte, mantenendo il
            controllo della scelta finale.
          </p>
          <p className="mt-2">
            L&apos;AI diventa così uno strumento per esplorare nuove
            prospettive, non una macchina che decide al posto tuo.
          </p>
        </div>
        <AngelaTip>
          Prova a chiedere sempre almeno due alternative quando lavori su idee,
          testi, strategie o progetti creativi.
        </AngelaTip>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          3 Metti l&apos;AI in discussione. Anche quando sembra convincente!
        </h2>
        <p className="max-w-3xl">
          L&apos;intelligenza artificiale può produrre risposte molto sicure e
          ben strutturate.
        </p>
        <p className="max-w-3xl">
          Ma una risposta convincente non è necessariamente una risposta
          corretta.
        </p>
        <p className="max-w-3xl">
          Ecco perché è importante non fermarsi al primo risultato.
        </p>
        <p className="max-w-3xl">
          Dopo aver ottenuto una proposta, prova ad aggiungere questa
          istruzione:
        </p>
        <PromptBlock label="Il prompt del revisore critico" tone="better">
          {`Analizza criticamente la risposta che hai appena prodotto.
Individua tre possibili punti deboli, spiega cosa potrebbe non funzionare e suggerisci come migliorarla.
Segnala eventuali informazioni che richiedono una verifica esterna.`}
        </PromptBlock>
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Perché funziona?
          </p>
          <p className="mt-2">
            Questa tecnica può aiutarti a individuare limiti, alternative e
            aspetti che non avevi considerato.
          </p>
          <p className="mt-2">
            Attenzione, però: l&apos;AI può sbagliare anche quando valuta le
            proprie risposte.
          </p>
          <p className="mt-2">
            Chiederle una revisione critica è utile, ma non sostituisce il
            controllo delle informazioni, soprattutto quando si tratta di dati,
            decisioni importanti o contenuti professionali.
          </p>
        </div>
        <AngelaTip>
          Utilizza l&apos;AI per ampliare il tuo punto di vista, non per
          rinunciare al tuo giudizio.
        </AngelaTip>
      </section>

      <section className="rounded-3xl bg-white p-5 text-neutral-900 md:p-7">
        <h2 className="text-2xl font-extrabold tracking-tight text-black md:text-3xl">
          Il vero segreto di un buon prompt
        </h2>
        <div className="mt-4 max-w-3xl space-y-4">
          <p>
            Spesso pensiamo che utilizzare bene l&apos;intelligenza artificiale
            significhi conoscere comandi particolari, formule complesse o parole
            tecniche.
          </p>
          <p>In realtà, il punto di partenza è molto più semplice.</p>
          <p>Prima di scrivere un prompt, prova a porti tre domande:</p>
        </div>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          <li className="rounded-2xl bg-neutral-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
              Cosa
            </p>
            <h3 className="mt-2 text-lg font-extrabold text-black">
              Cosa voglio ottenere?
            </h3>
            <p className="mt-2 text-sm text-neutral-700">
              Qual è il mio obiettivo concreto?
            </p>
          </li>
          <li className="rounded-2xl bg-neutral-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
              Quali
            </p>
            <h3 className="mt-2 text-lg font-extrabold text-black">
              Quali informazioni servono?
            </h3>
            <p className="mt-2 text-sm text-neutral-700">
              Che cosa deve sapere l&apos;AI per comprendere la mia richiesta?
            </p>
          </li>
          <li className="rounded-2xl bg-neutral-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
              Come
            </p>
            <h3 className="mt-2 text-lg font-extrabold text-black">
              Come voglio il risultato?
            </h3>
            <p className="mt-2 text-sm text-neutral-700">
              In quale formato, con quale stile e con quali caratteristiche?
            </p>
          </li>
        </ol>
        <p className="mt-6 max-w-3xl">
          Sono tre domande che possono cambiare profondamente il modo in cui
          utilizzi questi strumenti.
        </p>
        <p className="mt-2 max-w-3xl">
          Perché un buon prompt nasce prima di tutto da un pensiero chiaro.
        </p>
        <blockquote className="mt-6 border-l-4 border-leanme-fuchsia pl-4 text-xl font-extrabold leading-snug text-black md:text-2xl">
          {QUOTE}
        </blockquote>
      </section>

      <section
        id="lean-prompt-builder"
        className="scroll-mt-28 rounded-3xl bg-leanme-fuchsia p-5 text-white md:p-8"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
          Lean Prompt Builder v1.0
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">
          Dall&apos;idea al prompt. In 3 mosse.
        </h2>
        <div className="mt-4 max-w-3xl space-y-4">
          <p>E se non sapessi ancora come trasformare un&apos;idea in un prompt efficace?</p>
          <p>
            Lean Prompt Builder v1.0 è il laboratorio che ti accompagna proprio
            in quel passaggio: dall&apos;idea che hai in mente al prompt pronto
            da usare.
          </p>
          <p>Non è una nuova chat AI. È un percorso guidato, breve, in tre mosse.</p>
        </div>
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          <li className="rounded-2xl bg-white p-4 text-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">
              1
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-black">
              Racconta la tua idea
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Scrivi liberamente quello che vorresti fare con l&apos;intelligenza
              artificiale. Può essere un testo da scrivere, un&apos;immagine da
              creare, un documento da analizzare o un progetto da sviluppare.
            </p>
          </li>
          <li className="rounded-2xl bg-white p-4 text-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">
              2
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-black">
              Rispondi a tre domande
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Il Builder ti aiuta a mettere a fuoco la richiesta. Niente
              conversazioni interminabili. Solo le informazioni davvero utili.
            </p>
          </li>
          <li className="rounded-2xl bg-white p-4 text-neutral-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">
              3
            </span>
            <h3 className="mt-3 text-lg font-extrabold text-black">
              Ottieni il tuo prompt
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Ricevi un prompt strutturato, pronto da copiare. Vedi anche come
              è stato costruito e quale strumento gratuito può esserti utile.
            </p>
          </li>
        </ol>
        <p className="mt-6 max-w-3xl font-semibold">
          Non è solo un prompt migliore. È il modo per imparare a costruirlo da solo.
        </p>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
          Versione beta gratuita fino al 19 novembre 2026
        </p>
        <Link
          href="/prompt-builder"
          className="mx-auto mt-6 flex min-h-16 w-full max-w-xl items-center justify-center rounded-full bg-black px-8 text-center text-lg font-extrabold tracking-tight text-white transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-xl"
        >
          Prova il Lean Prompt Builder
        </Link>
        <p className="mt-3 text-sm text-white/85">
          Accesso gratuito con una semplice registrazione. Nessun abbonamento e
          nessun pagamento automatico.
        </p>
      </section>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { toolById } from "@/lib/prompt-builder/catalog";
import type { LabPart, LabQuestion, PartKind } from "@/lib/prompt-builder/types";

const ANGELA = "/assets/official/agenti-schede/angela-portrait.jpg";

const SUGGESTIONS = [
  "Voglio scrivere un testo.",
  "Voglio creare un'immagine.",
  "Voglio analizzare dei dati.",
  "Voglio sviluppare un'idea.",
  "Voglio studiare o imparare qualcosa.",
];

const PART_LABEL: Record<PartKind, string> = {
  ruolo: "Ruolo",
  obiettivo: "Obiettivo",
  contesto: "Contesto",
  formato: "Formato",
  verifica: "Verifica",
};

const PART_CLASS: Record<PartKind, string> = {
  ruolo: "text-leanme-fuchsia",
  obiettivo: "text-[#8adfff]",
  contesto: "text-[#c4b5fd]",
  formato: "text-[#ff8abe]",
  verifica: "text-white/80",
};

type Phase = "loading" | "closed" | "gate" | "idea" | "who" | "focus" | "skip" | "result";

interface ResultPayload {
  runId: string;
  idea: string;
  prompt: string;
  parts: LabPart[];
  why: Array<{ kind: PartKind; meaning: string }>;
  toolId: string;
  toolBecause: string;
  alternatives: string[];
}

function AngelaNote({ children }: { children: string }) {
  return (
    <div className="mt-4 flex gap-3 rounded-2xl bg-black/40 p-3">
      <span className="block h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-black">
        <img src={ANGELA} alt="" className="h-full w-full object-cover object-top" />
      </span>
      <p className="text-sm leading-relaxed text-white/85">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#c4b5fd]">
          Angela ti spiega
        </span>
        {children}
      </p>
    </div>
  );
}

function paintPrompt(prompt: string, parts: LabPart[]) {
  const ranges: Array<{ start: number; end: number; kind: PartKind }> = [];
  for (const part of parts) {
    const start = prompt.indexOf(part.text);
    if (start < 0) continue;
    const end = start + part.text.length;
    if (ranges.some((range) => start < range.end && end > range.start)) continue;
    ranges.push({ start, end, kind: part.kind });
  }
  ranges.sort((a, b) => a.start - b.start);
  const nodes: Array<string | { key: string; kind: PartKind; text: string }> = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.start > cursor) nodes.push(prompt.slice(cursor, range.start));
    nodes.push({
      key: `${range.kind}-${index}`,
      kind: range.kind,
      text: prompt.slice(range.start, range.end),
    });
    cursor = range.end;
  });
  if (cursor < prompt.length) nodes.push(prompt.slice(cursor));
  return nodes;
}

export function PromptLab() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [expiresLabel, setExpiresLabel] = useState("19 novembre 2026");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [idea, setIdea] = useState("");
  const [contact, setContact] = useState("");
  const [afterWho, setAfterWho] = useState<"focus" | "skip">("focus");
  const [questions, setQuestions] = useState<LabQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [other, setOther] = useState("");
  const [skipNote, setSkipNote] = useState("");
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"utile" | "da_rifare" | null>(null);
  const [note, setNote] = useState("");
  const [thanks, setThanks] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/prompt-builder/me")
      .then((response) => response.json())
      .then((payload: { open?: boolean; expiresLabel?: string; name?: string | null }) => {
        if (payload.expiresLabel) setExpiresLabel(payload.expiresLabel);
        if (payload.name) setContact(payload.name);
        if (!payload.open) {
          setPhase("closed");
          return;
        }
        setPhase(payload.name ? "idea" : "gate");
      })
      .catch(() => setPhase("gate"));
  }, []);

  const question = questions[questionIndex];
  const painted = useMemo(
    () => (result ? paintPrompt(result.prompt, result.parts) : []),
    [result]
  );
  const tool = result ? toolById(result.toolId) : undefined;
  const alternatives = (result?.alternatives ?? [])
    .map((id) => toolById(id)?.name)
    .filter((item): item is string => Boolean(item));

  async function enter(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt-builder/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          privacyAccepted: privacy,
          marketingOptIn: marketing,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Non riesco a farti entrare.");
        return;
      }
      setPhase("idea");
    } catch {
      setError("Connessione interrotta. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  async function askQuestions(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt-builder/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const payload = (await response.json()) as {
        error?: string;
        ready?: boolean;
        angela?: string;
        questions?: LabQuestion[];
      };
      if (!response.ok) {
        setError(payload.error ?? "Non riesco a preparare le domande.");
        return;
      }
      const next = payload.questions ?? [];
      setQuestions(next);
      setQuestionIndex(0);
      setAnswers({});
      setOther("");
      if (next.length === 0) {
        setSkipNote(
          payload.angela ||
            "Obiettivo, contesto e forma ci sono già. Si può scrivere il prompt."
        );
        setAfterWho("skip");
      } else {
        setAfterWho("focus");
      }
      setPhase("who");
    } catch {
      setError("Connessione interrotta. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  async function saveWho(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt-builder/who", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Inserisci il tuo nome o la tua email.");
        return;
      }
      setPhase(afterWho);
    } catch {
      setError("Connessione interrotta. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  function choose(value: string) {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setOther("");
  }

  function currentAnswer(): string {
    if (!question) return "";
    return (other.trim() || answers[question.id] || "").trim();
  }

  async function continueFocus() {
    if (!question) return;
    const value = currentAnswer();
    if (value.length < 2) {
      setError("Scegli una risposta o scrivi la tua.");
      return;
    }
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    setOther("");
    setError(null);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }
    await compose(
      questions.map((item) => ({
        id: item.id,
        value: nextAnswers[item.id] ?? "",
      }))
    );
  }

  async function compose(payloadAnswers: Array<{ id: string; value: string }>) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/prompt-builder/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payloadAnswers }),
      });
      const payload = (await response.json()) as ResultPayload & { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Non riesco a scrivere il prompt.");
        return;
      }
      setResult(payload);
      setWhyOpen(false);
      setCopied(false);
      setFeedback(null);
      setNote("");
      setThanks(false);
      setPhase("result");
    } catch {
      setError("Connessione interrotta. Riprova.");
    } finally {
      setBusy(false);
    }
  }

  async function copyPrompt() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      void fetch("/api/prompt-builder/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: result.runId, type: "copy" }),
      });
    } catch {
      setError("Non riesco a copiare da qui. Seleziona il testo del prompt.");
    }
  }

  async function sendFeedback(value: "utile" | "da_rifare") {
    if (!result) return;
    setFeedback(value);
    setBusy(true);
    try {
      const response = await fetch("/api/prompt-builder/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: result.runId,
          type: "feedback",
          feedback: value,
          note,
        }),
      });
      if (response.ok) setThanks(true);
    } finally {
      setBusy(false);
    }
  }

  function restart() {
    setIdea("");
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setError(null);
    setPhase("idea");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leanme-fuchsia">
        Lean Prompt Builder v1.0
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
        Dall&apos;idea al prompt. In 3 mosse.
      </h1>
      <p className="mt-3 text-sm text-white/60">
        Beta gratuita fino al {expiresLabel}. Circa un minuto. Non è una chat.
      </p>

      {phase === "loading" ? (
        <p className="mt-10 text-sm text-white/50">Apro il laboratorio…</p>
      ) : null}

      {phase === "closed" ? (
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#16161a] p-6">
          <h2 className="text-2xl font-extrabold text-white">
            La beta gratuita è conclusa.
          </h2>
          <p className="mt-3 text-white/75">
            Il laboratorio non genera nuovi prompt. L&apos;articolo della puntata
            resta disponibile. Non parte nessun pagamento.
          </p>
          <Link
            href="/leanlab/articolo/come-scrivere-prompt-migliori"
            className="mt-5 inline-flex text-sm font-semibold text-leanme-fuchsia underline-offset-4 hover:underline"
          >
            Torna all&apos;articolo
          </Link>
        </section>
      ) : null}

      {phase === "gate" ? (
        <form onSubmit={enter} className="mt-8 space-y-4 rounded-3xl bg-[#16161a] p-5 md:p-7">
          <h2 className="text-2xl font-extrabold text-white">
            Ti interessa questo argomento?
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            Con nome e email entri nel laboratorio. Se vuoi, ti aggiorniamo anche
            sui prossimi corsi a pagamento. Quella scelta non è obbligatoria.
          </p>
          <label className="block text-sm">
            <span className="text-white/70">Nome</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="given-name"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black px-3 py-3 text-white outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/70">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black px-3 py-3 text-white outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <label className="flex gap-3 text-sm leading-relaxed text-white/80">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(event) => setPrivacy(event.target.checked)}
              className="mt-1"
            />
            <span>
              Ho letto l&apos;
              <Link href="/privacy" className="text-leanme-fuchsia underline-offset-2 hover:underline">
                informativa privacy
              </Link>{" "}
              e le{" "}
              <Link href="/termini-ia" className="text-leanme-fuchsia underline-offset-2 hover:underline">
                condizioni d&apos;uso dell&apos;AI
              </Link>
              . Richiesta e prompt restano conservati per migliorare il laboratorio.
            </span>
          </label>
          <label className="flex gap-3 text-sm leading-relaxed text-white/80">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              className="mt-1"
            />
            <span>Voglio aggiornamenti sui prossimi corsi a pagamento.</span>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Entro…" : "Mi interessa, voglio il Prompt Builder"}
          </button>
          {error ? <p className="text-sm text-[#ff8abe]">{error}</p> : null}
        </form>
      ) : null}

      {phase === "idea" ? (
        <form onSubmit={askQuestions} className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
            1 · La tua idea
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Che cosa vorresti fare con l&apos;intelligenza artificiale?
          </h2>
          <AngelaNote>
            Non scegliere ancora lo strumento. Prima chiarisci il risultato che vuoi ottenere.
          </AngelaNote>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setIdea(suggestion)}
                className="rounded-full border border-white/15 px-3 py-2 text-left text-xs font-semibold text-white/80 hover:border-leanme-fuchsia"
              >
                {suggestion.replace(/\.$/, "")}
              </button>
            ))}
          </div>
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            required
            minLength={8}
            maxLength={600}
            rows={5}
            placeholder="Scrivilo come lo diresti a una persona."
            className="mt-4 w-full rounded-2xl border border-white/15 bg-[#16161a] px-4 py-3 text-base text-white outline-none focus:border-leanme-fuchsia"
          />
          <p className="mt-2 text-xs text-white/45">
            Non inserire password, dati sensibili o informazioni aziendali riservate.
          </p>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Scelgo le domande…" : "Metti a fuoco"}
          </button>
          {error ? <p className="mt-3 text-sm text-[#ff8abe]">{error}</p> : null}
        </form>
      ) : null}

      {phase === "who" ? (
        <form onSubmit={saveWho} className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
            Prima domanda · obbligatoria
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Inserisci il tuo nome o la tua email
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Ci serve per sapere chi usa il laboratorio. Basta uno dei due.
          </p>
          <input
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            required
            minLength={2}
            maxLength={254}
            autoComplete="username"
            className="mt-4 w-full rounded-2xl border border-white/15 bg-[#16161a] px-4 py-3 text-base text-white outline-none focus:border-leanme-fuchsia"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Salvo…" : "Continua"}
          </button>
          {error ? <p className="mt-3 text-sm text-[#ff8abe]">{error}</p> : null}
        </form>
      ) : null}

      {phase === "focus" && question ? (
        <section className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
            2 · Messa a fuoco · domanda {questionIndex + 1} di {questions.length}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">{question.prompt}</h2>
          {question.angela ? <AngelaNote>{question.angela}</AngelaNote> : null}
          <div className="mt-4 grid gap-2">
            {question.options.map((option) => {
              const selected = answers[question.id] === option && !other;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                    selected
                      ? "border-leanme-fuchsia bg-leanme-fuchsia/15 text-white"
                      : "border-white/10 bg-[#16161a] text-white/80"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <label className="mt-3 block text-sm text-white/60">
            Altro
            <input
              value={other}
              onChange={(event) => setOther(event.target.value)}
              maxLength={200}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black px-3 py-3 text-white outline-none focus:border-leanme-fuchsia"
            />
          </label>
          <button
            type="button"
            onClick={() => void continueFocus()}
            disabled={busy}
            className="mt-5 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy
              ? "Scrivo il prompt…"
              : questionIndex < questions.length - 1
                ? "Domanda successiva"
                : "Crea il prompt"}
          </button>
          {error ? <p className="mt-3 text-sm text-[#ff8abe]">{error}</p> : null}
        </section>
      ) : null}

      {phase === "skip" ? (
        <section className="mt-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
            2 · Messa a fuoco
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            La richiesta è già abbastanza chiara.
          </h2>
          <AngelaNote>{skipNote}</AngelaNote>
          <button
            type="button"
            onClick={() => void compose([])}
            disabled={busy}
            className="mt-5 inline-flex min-h-12 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Scrivo il prompt…" : "Crea il prompt"}
          </button>
          {error ? <p className="mt-3 text-sm text-[#ff8abe]">{error}</p> : null}
        </section>
      ) : null}

      {phase === "result" && result ? (
        <section className="mt-8 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
            3 · Il tuo prompt
          </p>
          <div className="rounded-3xl bg-[#16161a] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
              Prima
            </p>
            <p className="mt-1 text-sm text-white/50">{result.idea}</p>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-leanme-fuchsia">
              Dopo
            </p>
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-white">
              {painted.map((node, index) =>
                typeof node === "string" ? (
                  <span key={`t-${index}`}>{node}</span>
                ) : (
                  <span key={node.key} className={`font-semibold ${PART_CLASS[node.kind]}`}>
                    {node.text}
                  </span>
                )
              )}
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              Hai appena trasformato una richiesta generica in un&apos;istruzione più efficace.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void copyPrompt()}
                className="inline-flex min-h-11 items-center rounded-full bg-leanme-fuchsia px-5 text-sm font-semibold text-white"
              >
                {copied ? "Prompt copiato" : "Copia il prompt"}
              </button>
              <button
                type="button"
                onClick={() => setWhyOpen((open) => !open)}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8adfff]"
              >
                {whyOpen ? "Chiudi la spiegazione" : "Perché questo prompt funziona?"}
              </button>
            </div>
            {whyOpen ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {(result.why.length
                  ? result.why
                  : result.parts.map((part) => ({
                      kind: part.kind,
                      meaning: "Rende l'istruzione più precisa.",
                    }))
                ).map((item) => (
                  <li key={item.kind} className="rounded-xl bg-black/40 px-3 py-2 text-xs text-white/75">
                    <span className={`font-bold ${PART_CLASS[item.kind]}`}>
                      {PART_LABEL[item.kind]}.{" "}
                    </span>
                    {item.meaning}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {tool ? (
            <div className="rounded-3xl border border-white/10 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8adfff]">
                Dove usare questo prompt
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-white">
                Consigliato per questo caso: {tool.name}
              </h2>
              <p className="mt-2 text-sm text-white/75">{result.toolBecause}</p>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white"
              >
                Apri {tool.name}
              </a>
              {alternatives.length ? (
                <p className="mt-3 text-sm text-white/50">
                  Alternative da valutare: {alternatives.join(", ")}.
                </p>
              ) : null}
              <p className="mt-2 text-xs text-white/40">
                Il prompt si copia e si incolla lì. Il laboratorio non parla con quello strumento.
              </p>
            </div>
          ) : null}

          <div className="rounded-3xl bg-[#16161a] p-5">
            <p className="text-sm font-semibold text-white">Hai provato questo prompt?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void sendFeedback("utile")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  feedback === "utile" ? "bg-leanme-fuchsia text-white" : "bg-black text-white/80"
                }`}
              >
                Utile
              </button>
              <button
                type="button"
                onClick={() => void sendFeedback("da_rifare")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  feedback === "da_rifare" ? "bg-leanme-fuchsia text-white" : "bg-black text-white/80"
                }`}
              >
                Da rifare
              </button>
            </div>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={280}
              placeholder="Una riga, se vuoi."
              className="mt-3 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none"
            />
            {thanks ? (
              <p className="mt-2 text-sm text-white/60">
                Grazie. Serve a migliorare il laboratorio.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={restart}
            className="text-sm font-semibold text-white/70 underline-offset-4 hover:underline"
          >
            Crea un altro prompt
          </button>
          {error ? <p className="text-sm text-[#ff8abe]">{error}</p> : null}
        </section>
      ) : null}
    </div>
  );
}

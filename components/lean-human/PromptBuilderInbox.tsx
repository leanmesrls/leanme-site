"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  name: string;
  email: string;
  marketingOptIn: boolean;
  updatedAt: string;
  composeCount: number;
  latestIdea: string | null;
  latestTool: string | null;
  latestFeedback: "utile" | "da_rifare" | null;
};

type Detail = {
  name: string;
  email: string;
  marketingOptIn: boolean;
  runs: Array<{
    id: string;
    idea: string;
    prompt: string;
    toolId: string;
    toolBecause: string;
    createdAt: string;
    feedback: "utile" | "da_rifare" | null;
    feedbackNote: string;
    questions: Array<{ prompt: string; value: string }>;
  }>;
};

function when(iso: string): string {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function PromptBuilderInbox() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/prompt-builder/admin")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/lean-human/login");
          return null;
        }
        return (await response.json()) as { profiles?: Row[]; error?: string };
      })
      .then((payload) => {
        if (!payload) return;
        if (payload.error) setError(payload.error);
        setRows(payload.profiles ?? []);
      })
      .catch(() => setError("Errore caricamento."));
  }, [router]);

  async function openRow(id: string) {
    const response = await fetch(`/api/prompt-builder/admin/${id}`);
    if (response.status === 401) {
      router.replace("/lean-human/login");
      return;
    }
    const payload = (await response.json()) as { profile?: Detail; error?: string };
    if (!payload.profile) {
      setError(payload.error ?? "Scheda non disponibile.");
      return;
    }
    setDetail(payload.profile);
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 md:px-10 lg:grid-cols-[22rem_1fr]">
      <aside className="rounded-2xl border border-white/10 bg-[#111111]">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Lean.Human
          </p>
          <h1 className="text-lg font-semibold text-white">Prompt Builder</h1>
          <Link
            href="/lean-human"
            className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 hover:text-white"
          >
            Teresa pubblica
          </Link>
          <Link
            href="/lean-human/interesse"
            className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 hover:text-white"
          >
            Interesse articoli
          </Link>
        </div>
        <ul className="max-h-[70vh] overflow-y-auto">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => void openRow(row.id)}
                className="w-full border-b border-white/5 px-4 py-3 text-left hover:bg-white/[0.04]"
              >
                <p className="text-sm font-medium text-white">
                  {row.name}
                </p>
                <p className="text-xs text-white/45">{row.email}</p>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">
                  {row.latestIdea ?? "Nessun prompt ancora."}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-white/35">
                  {when(row.updatedAt)} · {row.composeCount} prompt
                  {row.latestFeedback ? ` · ${row.latestFeedback}` : ""}
                  {row.marketingOptIn ? " · corsi" : ""}
                </p>
              </button>
            </li>
          ))}
        </ul>
        {error ? <p className="p-4 text-sm text-red-300">{error}</p> : null}
        {rows.length === 0 && !error ? (
          <p className="p-4 text-sm text-white/50">Nessuna scheda.</p>
        ) : null}
      </aside>
      <section className="space-y-4">
        {!detail ? (
          <p className="text-sm text-white/50">Apri una scheda per leggere idea, domande e prompt.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white">
              {detail.name} · {detail.email}
            </h2>
            {detail.runs.map((run) => (
              <article key={run.id} className="rounded-2xl border border-white/10 bg-[#111111] p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">
                  {when(run.createdAt)} · {run.toolId}
                  {run.feedback ? ` · ${run.feedback}` : ""}
                </p>
                <p className="mt-2 text-sm text-white/60">{run.idea}</p>
                <ul className="mt-3 space-y-1 text-sm text-white/75">
                  {run.questions.map((question) => (
                    <li key={question.prompt}>
                      <span className="text-white/45">{question.prompt} </span>
                      {question.value}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white">
                  {run.prompt}
                </p>
                {run.feedbackNote ? (
                  <p className="mt-2 text-sm text-[#ff8abe]">{run.feedbackNote}</p>
                ) : null}
              </article>
            ))}
          </>
        )}
      </section>
    </div>
  );
}

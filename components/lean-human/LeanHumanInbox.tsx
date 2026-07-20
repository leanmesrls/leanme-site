"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ThreadRow = {
  id: string;
  updatedAt: string;
  createdAt: string;
  lead: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  messageCount: number;
  notifiedAt: string | null;
  readAt: string | null;
  lastPreview: string | null;
};

type ThreadDetail = {
  id: string;
  lead: ThreadRow["lead"] & { acceptedAiTermsAt?: string } | null;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }>;
  notifiedAt: string | null;
};

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function LeanHumanInbox() {
  const router = useRouter();
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    const response = await fetch("/api/teresa/admin/threads");
    if (response.status === 401) {
      router.replace("/lean-human/login");
      return;
    }
    const payload = (await response.json()) as {
      threads?: ThreadRow[];
      error?: string;
    };
    if (!response.ok) {
      setError(payload.error ?? "Errore caricamento.");
      return;
    }
    setThreads(payload.threads ?? []);
  }, [router]);

  useEffect(() => {
    void loadThreads()
      .catch(() => setError("Errore caricamento."))
      .finally(() => setLoading(false));
  }, [loadThreads]);

  async function openThread(id: string) {
    setSelectedId(id);
    setDetail(null);
    const response = await fetch(`/api/teresa/admin/threads/${id}`);
    if (response.status === 401) {
      router.replace("/lean-human/login");
      return;
    }
    const payload = (await response.json()) as {
      thread?: ThreadDetail;
      error?: string;
    };
    if (!response.ok || !payload.thread) {
      setError(payload.error ?? "Dettaglio non disponibile.");
      return;
    }
    setDetail(payload.thread);
    void loadThreads();
  }

  async function logout() {
    await fetch("/api/teresa/admin/logout", { method: "POST" });
    router.replace("/lean-human/login");
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 md:px-10 lg:grid-cols-[22rem_1fr] lg:px-12">
      <aside className="rounded-2xl border border-white/10 bg-[#111111]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
              Lean.Human
            </p>
            <h1 className="text-lg font-semibold text-white">Teresa pubblica</h1>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="text-[11px] uppercase tracking-[0.08em] text-white/50 hover:text-white"
          >
            Esci
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-white/50">Caricamento…</p>
          ) : null}
          {error ? <p className="p-4 text-sm text-red-300">{error}</p> : null}
          {!loading && threads.length === 0 ? (
            <p className="p-4 text-sm text-white/50">Nessuna conversazione.</p>
          ) : null}
          <ul>
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => void openThread(thread.id)}
                  className={`w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.04] ${
                    selectedId === thread.id ? "bg-white/[0.06]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {thread.lead
                        ? `${thread.lead.firstName} ${thread.lead.lastName}`
                        : "Lead incompleto"}
                    </p>
                    {!thread.readAt ? (
                      <span className="h-2 w-2 rounded-full bg-leanme-fuchsia" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    {thread.lead?.email ?? "—"} · {formatWhen(thread.updatedAt)}
                  </p>
                  {thread.lastPreview ? (
                    <p className="mt-1 line-clamp-2 text-xs text-white/55">
                      {thread.lastPreview}
                    </p>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5 md:p-6">
        {!detail ? (
          <p className="text-sm text-white/50">
            Seleziona una conversazione per leggerla.
          </p>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {detail.lead
                  ? `${detail.lead.firstName} ${detail.lead.lastName}`
                  : "Conversazione"}
              </h2>
              <p className="mt-1 text-sm text-white/55">
                {detail.lead?.email ?? "Email non disponibile"}
              </p>
              <p className="mt-1 text-xs text-white/35">
                Notifica email:{" "}
                {detail.notifiedAt
                  ? `inviata ${formatWhen(detail.notifiedAt)}`
                  : "non inviata / non configurata"}
              </p>
            </div>
            <div className="space-y-3">
              {detail.messages
                .filter((message) => message.role !== "system")
                .map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-leanme-fuchsia/20 text-white"
                        : "bg-white/5 text-white/85"
                    }`}
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-[0.1em] text-white/40">
                      {message.role === "user" ? "Visitatore" : "Teresa"} ·{" "}
                      {formatWhen(message.createdAt)}
                    </p>
                    {message.content}
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

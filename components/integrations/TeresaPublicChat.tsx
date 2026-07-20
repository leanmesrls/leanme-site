"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { TeresaRailChevron } from "@/components/integrations/TeresaRailChevron";
import { cn } from "@/lib/utils";

const BADGE_SRC = "/assets/official/leanyou/agent-badges/teresa.png";
const STORAGE_KEY = "leanme.teresa-public-rail";
const ACTIVE_THREAD_KEY = "leanme.teresa-public-active-thread";
const MIN_WIDTH = 280;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 340;

type Lead = {
  firstName: string;
  lastName: string;
  email: string;
  acceptedAiTermsAt: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

type ThreadSummary = {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
  lastPreview: string | null;
};

type StoredRail = {
  open: boolean;
  width: number;
};

type ChatPayload = {
  threadId?: string;
  activeThreadId?: string | null;
  lead?: Lead | null;
  messages?: ChatMessage[];
  threads?: ThreadSummary[];
  maxMessagesPerThread?: number;
  error?: string;
};

function readStored(): StoredRail {
  if (typeof window === "undefined") {
    return { open: true, width: DEFAULT_WIDTH };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { open: true, width: DEFAULT_WIDTH };
    }
    const parsed = JSON.parse(raw) as Partial<StoredRail>;
    return {
      open: parsed.open !== false,
      width: Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, Number(parsed.width) || DEFAULT_WIDTH)
      ),
    };
  } catch {
    return { open: true, width: DEFAULT_WIDTH };
  }
}

function writeStored(state: StoredRail) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function readActiveThreadId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_THREAD_KEY);
  } catch {
    return null;
  }
}

function writeActiveThreadId(threadId: string | null) {
  try {
    if (!threadId) {
      localStorage.removeItem(ACTIVE_THREAD_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_THREAD_KEY, threadId);
  } catch {
    /* ignore */
  }
}

function TeresaMessages({
  messages,
  loading,
  error,
  leadMissing,
}: {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  leadMissing: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, leadMissing]);

  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {leadMissing ? (
        <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm text-white/70">
          <p>
            Ciao, sono{" "}
            <span className="text-leanme-fuchsia">Lean.Agent.Teresa</span>.
            Posso aiutarti sui contenuti del sito, le attività LeanMe e la Suite.
          </p>
          <p>
            Per continuare, indica nome, cognome e e-mail. I dati restano
            tracciati dal team LeanMe.
          </p>
        </div>
      ) : null}

      {!leadMissing && messages.length === 0 && !loading ? (
        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm text-white/70">
          Conversazione pronta. Scrivi pure a Teresa.
        </div>
      ) : null}

      {messages
        .filter((message) => message.role !== "system")
        .map((message) => (
          <div
            key={message.id}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm",
              message.role === "user"
                ? "ml-4 border border-leanme-fuchsia/30 bg-leanme-fuchsia/10 text-white"
                : "mr-2 border border-white/10 bg-black/40 text-white/80"
            )}
          >
            {message.role === "assistant" ? (
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-leanme-fuchsia">
                Teresa
              </p>
            ) : null}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}

      {loading ? (
        <p className="text-xs text-white/45">Teresa sta scrivendo…</p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}

/**
 * Barra laterale espandibile Lean.Agent.Teresa — allineata a LeanEvent.
 * Solo sito pubblico (non tenant / progetti).
 */
export function TeresaPublicChat() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [threadsOpen, setThreadsOpen] = useState(false);
  const [maxMessages, setMaxMessages] = useState(50);
  const [draft, setDraft] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedAiTerms, setAcceptedAiTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragging = useRef(false);
  const historyLoaded = useRef(false);

  const applyPayload = useCallback((payload: ChatPayload) => {
    const nextId = payload.activeThreadId ?? payload.threadId ?? null;
    if (nextId !== undefined) {
      setThreadId(nextId);
      writeActiveThreadId(nextId);
    }
    if (payload.lead !== undefined) {
      setLead(payload.lead ?? null);
    }
    if (payload.messages) {
      setMessages(payload.messages);
    }
    if (payload.threads) {
      setThreads(payload.threads);
    }
    if (typeof payload.maxMessagesPerThread === "number") {
      setMaxMessages(payload.maxMessagesPerThread);
    }
  }, []);

  const loadChat = useCallback(
    async (preferredThreadId?: string | null) => {
      const preferred = preferredThreadId ?? readActiveThreadId();
      const url = preferred
        ? `/api/teresa/chat?threadId=${encodeURIComponent(preferred)}`
        : "/api/teresa/chat";
      const response = await fetch(url);
      const payload = (await response.json()) as ChatPayload;
      if (!response.ok) {
        setError(payload.error ?? "Errore di caricamento.");
        return;
      }
      applyPayload(payload);
    },
    [applyPayload]
  );

  useEffect(() => {
    const stored = readStored();
    setOpen(stored.open);
    setWidth(stored.width);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    writeStored({ open, width });
  }, [open, width, ready]);

  useEffect(() => {
    if (historyLoaded.current) {
      return;
    }
    historyLoaded.current = true;
    void loadChat().catch(() => setError("Errore di caricamento."));
  }, [loadChat]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragging.current = true;
      const startX = event.clientX;
      const startWidth = width;

      const onMove = (moveEvent: PointerEvent) => {
        if (!dragging.current) {
          return;
        }
        const next = startWidth + (startX - moveEvent.clientX);
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [width]
  );

  async function submitLead(event: FormEvent) {
    event.preventDefault();
    if (!threadId || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/teresa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lead",
          threadId,
          firstName,
          lastName,
          email,
          acceptedAiTerms,
        }),
      });
      const payload = (await response.json()) as ChatPayload;
      if (!response.ok) {
        setError(payload.error ?? "Dati non validi.");
        return;
      }
      applyPayload(payload);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const text = draft.trim();
    if (!threadId || !text || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    setDraft("");
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimistic]);

    try {
      const response = await fetch("/api/teresa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          threadId,
          message: text,
        }),
      });
      const payload = (await response.json()) as ChatPayload;
      if (!response.ok) {
        setMessages((current) =>
          current.filter((message) => message.id !== optimistic.id)
        );
        setDraft(text);
        setError(payload.error ?? "Invio non riuscito.");
        return;
      }
      applyPayload(payload);
    } catch {
      setMessages((current) =>
        current.filter((message) => message.id !== optimistic.id)
      );
      setDraft(text);
      setError("Connessione non riuscita. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function startNewThread() {
    if (loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/teresa/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "new_thread" }),
      });
      const payload = (await response.json()) as ChatPayload;
      if (!response.ok) {
        setError(payload.error ?? "Impossibile creare il thread.");
        return;
      }
      applyPayload(payload);
      setThreadsOpen(false);
      setDraft("");
    } catch {
      setError("Connessione non riuscita. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function openThread(id: string) {
    setThreadsOpen(false);
    setLoading(true);
    setError(null);
    try {
      await loadChat(id);
    } catch {
      setError("Impossibile aprire il thread.");
    } finally {
      setLoading(false);
    }
  }

  if (pathname?.startsWith("/lean-human")) {
    return null;
  }

  const leadForm = (
    <form
      onSubmit={submitLead}
      className="shrink-0 space-y-2 border-t border-white/10 p-3"
    >
      <input
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        placeholder="Nome"
        required
        className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm outline-none focus:border-leanme-fuchsia"
      />
      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Cognome"
        required
        className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm outline-none focus:border-leanme-fuchsia"
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
        className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm outline-none focus:border-leanme-fuchsia"
      />
      <label className="flex items-start gap-2 text-[11px] leading-snug text-white/55">
        <input
          type="checkbox"
          checked={acceptedAiTerms}
          onChange={(event) => setAcceptedAiTerms(event.target.checked)}
          className="mt-0.5 accent-leanme-fuchsia"
          required
        />
        <span>
          Accetto i{" "}
          <Link
            href="/termini-ia"
            className="text-leanme-fuchsia underline"
            target="_blank"
          >
            Termini IA
          </Link>{" "}
          e l&apos;informativa privacy.
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-leanme-fuchsia px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:cursor-not-allowed disabled:bg-leanme-fuchsia/40"
      >
        {loading ? "Salvataggio…" : "Inizia la chat"}
      </button>
    </form>
  );

  const composer = (
    <form
      className="shrink-0 border-t border-white/10 p-3"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        void sendMessage();
      }}
    >
      <label className="sr-only" htmlFor="teresa-public-draft">
        Messaggio per Teresa
      </label>
      <textarea
        id="teresa-public-draft"
        rows={3}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Scrivi a Teresa…"
        disabled={loading}
        className="w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/35 focus:border-leanme-fuchsia disabled:opacity-60"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
          }
        }}
      />
      <button
        type="submit"
        disabled={loading || !draft.trim()}
        className="mt-2 w-full rounded-md bg-leanme-fuchsia px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:cursor-not-allowed disabled:bg-leanme-fuchsia/40"
      >
        {loading ? "Invio…" : "Invia"}
      </button>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => setThreadsOpen((value) => !value)}
          className="rounded-md border border-white/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75 transition hover:border-white hover:text-white disabled:opacity-50"
        >
          {threadsOpen ? "Chiudi thread" : "Apri i thread"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void startNewThread()}
          className="rounded-md border border-white/20 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75 transition hover:border-white hover:text-white disabled:opacity-50"
        >
          Inizia nuovo thread
        </button>
      </div>
      <p className="mt-2 text-center text-[10px] leading-relaxed text-white/40">
        Ultimi {maxMessages} messaggi per conversazione ·{" "}
        <Link href="/termini-ia" className="hover:text-white/60">
          Termini IA
        </Link>
      </p>
    </form>
  );

  const threadsPanel = threadsOpen ? (
    <div className="shrink-0 border-t border-white/10 bg-black/50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
        Le tue conversazioni
      </p>
      {threads.length === 0 ? (
        <p className="mt-2 text-xs text-white/45">Nessun thread ancora.</p>
      ) : (
        <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
          {threads.map((thread) => (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => void openThread(thread.id)}
                className={cn(
                  "w-full rounded-md px-2 py-2 text-left transition",
                  thread.id === threadId
                    ? "bg-leanme-fuchsia/20"
                    : "hover:bg-white/[0.05]"
                )}
              >
                <p className="truncate text-xs font-medium text-white">
                  {thread.title}
                </p>
                <p className="truncate text-[10px] text-white/40">
                  {thread.messageCount}/{maxMessages} messaggi
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null;

  const header = (
    <header className="shrink-0 border-b border-white/10 px-4 py-3 pr-14">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white">
          <Image
            src={BADGE_SRC}
            alt=""
            width={36}
            height={36}
            className="object-cover object-[center_18%]"
          />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-leanme-fuchsia">
            Assistente AI
          </p>
          <p className="truncate text-sm font-semibold text-white">
            Lean.Agent.Teresa
          </p>
        </div>
      </div>
      <p className="mt-3 truncate text-[11px] text-white/45">
        Contesto: sito LeanMe e Suite
      </p>
    </header>
  );

  const chatBody = (
    <div className="flex min-h-0 flex-1 flex-col">
      {header}
      <TeresaMessages
        messages={messages}
        loading={loading}
        error={error}
        leadMissing={!lead}
      />
      {threadsPanel}
      {lead ? composer : leadForm}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "relative sticky top-0 hidden h-screen shrink-0 flex-col border-l border-white/10 bg-[#0a0a0a] xl:flex",
          open ? "" : "w-12"
        )}
        style={open ? { width } : undefined}
        aria-label="Assistente Lean.Agent.Teresa"
      >
        {open ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Ridimensiona colonna Teresa"
            onPointerDown={onResizePointerDown}
            className="absolute inset-y-0 left-0 z-10 w-1.5 cursor-col-resize touch-none hover:bg-leanme-fuchsia/40"
          />
        ) : null}

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-full flex-col items-center gap-3 px-2 py-4 text-white/60 transition hover:text-white"
            aria-label="Apri assistente Lean.Agent.Teresa"
            title="Apri Lean.Agent.Teresa"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15">
              <TeresaRailChevron direction="left" />
            </span>
            <span className="inline-flex h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-white">
              <Image
                src={BADGE_SRC}
                alt=""
                width={32}
                height={32}
                className="object-cover object-[center_18%]"
              />
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ writingMode: "vertical-rl" }}
            >
              Lean.Agent.Teresa
            </span>
          </button>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-white/15 text-white/60 transition hover:border-white/30 hover:text-white"
              aria-label="Chiudi colonna Teresa"
              title="Comprimi Teresa"
            >
              <TeresaRailChevron direction="right" />
            </button>
            {chatBody}
          </div>
        )}
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 right-4 z-[240] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/95 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg xl:hidden"
        aria-label="Apri assistente Lean.Agent.Teresa"
      >
        <span className="inline-flex h-7 w-7 overflow-hidden rounded-full border border-white/15 bg-white">
          <Image
            src={BADGE_SRC}
            alt=""
            width={28}
            height={28}
            className="object-cover object-[center_18%]"
          />
        </span>
        Lean.Agent.Teresa
      </button>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[250] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Assistente Lean.Agent.Teresa"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Chiudi Teresa"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col border-l border-white/10 bg-[#0a0a0a] shadow-2xl">
            <div className="relative flex min-h-0 flex-1 flex-col">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15"
                aria-label="Chiudi"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
              {chatBody}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

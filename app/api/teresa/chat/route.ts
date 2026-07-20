import { NextResponse } from "next/server";

import {
  getOrCreateVisitorThread,
  listVisitorThreadSummaries,
  saveVisitorLead,
  sendVisitorMessage,
  startNewVisitorThread,
  TERESA_PUBLIC_MAX_MESSAGES,
} from "@/lib/teresa-public/chat";
import { getOrSetVisitorId } from "@/lib/teresa-public/visitor";

export const runtime = "nodejs";

function chatPayload(
  thread: Awaited<ReturnType<typeof getOrCreateVisitorThread>>,
  threads: Awaited<ReturnType<typeof listVisitorThreadSummaries>>
) {
  return {
    threadId: thread.id,
    activeThreadId: thread.id,
    lead: thread.lead,
    messages: thread.messages,
    threads,
    maxMessagesPerThread: TERESA_PUBLIC_MAX_MESSAGES,
  };
}

export async function GET(request: Request) {
  try {
    const visitorId = await getOrSetVisitorId();
    const { searchParams } = new URL(request.url);
    const preferred = searchParams.get("threadId");
    const thread = await getOrCreateVisitorThread(visitorId, preferred);
    const threads = await listVisitorThreadSummaries(visitorId);
    return NextResponse.json(chatPayload(thread, threads));
  } catch (error) {
    console.error("[teresa-public] GET", error);
    return NextResponse.json(
      { error: "Impossibile caricare la chat." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const visitorId = await getOrSetVisitorId();
    const body = (await request.json()) as {
      action?: "lead" | "message" | "new_thread";
      threadId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      acceptedAiTerms?: boolean;
      message?: string;
    };

    if (body.action === "new_thread") {
      const thread = await startNewVisitorThread(visitorId);
      const threads = await listVisitorThreadSummaries(visitorId);
      return NextResponse.json(chatPayload(thread, threads));
    }

    if (!body.threadId) {
      return NextResponse.json({ error: "threadId mancante." }, { status: 400 });
    }

    if (body.action === "lead") {
      const thread = await saveVisitorLead(visitorId, body.threadId, {
        firstName: body.firstName ?? "",
        lastName: body.lastName ?? "",
        email: body.email ?? "",
        acceptedAiTerms: Boolean(body.acceptedAiTerms),
      });
      const threads = await listVisitorThreadSummaries(visitorId);
      return NextResponse.json(chatPayload(thread, threads));
    }

    if (body.action === "message") {
      const thread = await sendVisitorMessage(
        visitorId,
        body.threadId,
        body.message ?? ""
      );
      const threads = await listVisitorThreadSummaries(visitorId);
      return NextResponse.json(chatPayload(thread, threads));
    }

    return NextResponse.json({ error: "Azione non valida." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    const map: Record<string, { status: number; error: string }> = {
      THREAD_NOT_FOUND: { status: 404, error: "Conversazione non trovata." },
      AI_TERMS_REQUIRED: {
        status: 400,
        error: "Devi accettare i Termini IA per continuare.",
      },
      INVALID_LEAD: {
        status: 400,
        error: "Nome, cognome e e-mail validi sono obbligatori.",
      },
      LEAD_REQUIRED: {
        status: 400,
        error: "Completa i tuoi dati prima di scrivere.",
      },
      EMPTY_MESSAGE: { status: 400, error: "Messaggio vuoto." },
      MESSAGE_TOO_LONG: { status: 400, error: "Messaggio troppo lungo." },
      OPENAI_API_KEY_MISSING: {
        status: 503,
        error: "Assistente temporaneamente non disponibile.",
      },
    };
    const mapped = map[message];
    if (mapped) {
      return NextResponse.json(
        { error: mapped.error },
        { status: mapped.status }
      );
    }
    console.error("[teresa-public] POST", error);
    return NextResponse.json(
      { error: "Operazione non riuscita." },
      { status: 500 }
    );
  }
}

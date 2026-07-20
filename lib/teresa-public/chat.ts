import { randomUUID } from "node:crypto";

import type {
  TeresaPublicLead,
  TeresaPublicMessage,
  TeresaPublicThread,
} from "@/types/teresa-public";
import { notifyTeresaPublicLead } from "@/lib/teresa-public/notify";
import { callTeresaPublicModel } from "@/lib/teresa-public/openai";
import {
  createTeresaPublicThread,
  findLatestThreadForVisitor,
  getTeresaPublicThread,
  listTeresaPublicThreadsForVisitor,
  saveTeresaPublicThread,
} from "@/lib/teresa-public/storage";

const MAX_MESSAGE_CHARS = 2000;
export const TERESA_PUBLIC_MAX_MESSAGES = 50;

export type TeresaPublicThreadSummary = {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
  lastPreview: string | null;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function threadTitle(thread: TeresaPublicThread): string {
  const firstUser = thread.messages.find((message) => message.role === "user");
  if (firstUser?.content.trim()) {
    return firstUser.content.trim().slice(0, 48);
  }
  if (thread.lead) {
    return `Chat · ${thread.lead.firstName}`;
  }
  return "Nuova conversazione";
}

function threadPreview(thread: TeresaPublicThread): string | null {
  const lastUser = [...thread.messages]
    .reverse()
    .find((message) => message.role === "user");
  return lastUser?.content.trim().slice(0, 80) ?? null;
}

export function summarizeVisitorThreads(
  threads: TeresaPublicThread[]
): TeresaPublicThreadSummary[] {
  return threads.map((thread) => ({
    id: thread.id,
    title: threadTitle(thread),
    messageCount: thread.messages.filter(
      (message) => message.role === "user" || message.role === "assistant"
    ).length,
    updatedAt: thread.updatedAt,
    createdAt: thread.createdAt,
    lastPreview: threadPreview(thread),
  }));
}

export async function listVisitorThreadSummaries(
  visitorId: string
): Promise<TeresaPublicThreadSummary[]> {
  const threads = await listTeresaPublicThreadsForVisitor(visitorId);
  return summarizeVisitorThreads(threads);
}

export async function getOrCreateVisitorThread(
  visitorId: string,
  preferredThreadId?: string | null
): Promise<TeresaPublicThread> {
  if (preferredThreadId) {
    const preferred = await getTeresaPublicThread(preferredThreadId);
    if (preferred && preferred.visitorId === visitorId) {
      return preferred;
    }
  }
  const existing = await findLatestThreadForVisitor(visitorId);
  if (existing) {
    return existing;
  }
  return createTeresaPublicThread(visitorId);
}

/** Nuova conversazione: conserva il lead già acquisito, senza reinviare email. */
export async function startNewVisitorThread(
  visitorId: string
): Promise<TeresaPublicThread> {
  const previous = await findLatestThreadForVisitor(visitorId);
  const thread = await createTeresaPublicThread(visitorId);
  if (previous?.lead) {
    thread.lead = { ...previous.lead };
    thread.notifiedAt = previous.notifiedAt;
    thread.updatedAt = new Date().toISOString();
    await saveTeresaPublicThread(thread);
  }
  return thread;
}

export async function saveVisitorLead(
  visitorId: string,
  threadId: string,
  lead: {
    firstName: string;
    lastName: string;
    email: string;
    acceptedAiTerms: boolean;
  }
): Promise<TeresaPublicThread> {
  const thread = await getTeresaPublicThread(threadId);
  if (!thread || thread.visitorId !== visitorId) {
    throw new Error("THREAD_NOT_FOUND");
  }
  if (!lead.acceptedAiTerms) {
    throw new Error("AI_TERMS_REQUIRED");
  }

  const firstName = lead.firstName.trim();
  const lastName = lead.lastName.trim();
  const email = lead.email.trim().toLowerCase();
  if (!firstName || !lastName || !isValidEmail(email)) {
    throw new Error("INVALID_LEAD");
  }

  const now = new Date().toISOString();
  const nextLead: TeresaPublicLead = {
    firstName,
    lastName,
    email,
    acceptedAiTermsAt: now,
  };

  const wasComplete = Boolean(thread.lead);
  thread.lead = nextLead;
  thread.updatedAt = now;
  await saveTeresaPublicThread(thread);

  // Notifica email solo alla prima acquisizione lead (chat pubblica).
  if (!wasComplete && !thread.notifiedAt) {
    const result = await notifyTeresaPublicLead(thread);
    if (result.sent) {
      thread.notifiedAt = now;
      await saveTeresaPublicThread(thread);
    }
  }

  return thread;
}

export async function sendVisitorMessage(
  visitorId: string,
  threadId: string,
  content: string
): Promise<TeresaPublicThread> {
  const thread = await getTeresaPublicThread(threadId);
  if (!thread || thread.visitorId !== visitorId) {
    throw new Error("THREAD_NOT_FOUND");
  }
  if (!thread.lead) {
    throw new Error("LEAD_REQUIRED");
  }

  const text = content.trim();
  if (!text) {
    throw new Error("EMPTY_MESSAGE");
  }
  if (text.length > MAX_MESSAGE_CHARS) {
    throw new Error("MESSAGE_TOO_LONG");
  }

  const now = new Date().toISOString();
  const userMessage: TeresaPublicMessage = {
    id: randomUUID(),
    role: "user",
    content: text,
    createdAt: now,
  };
  thread.messages.push(userMessage);
  thread.updatedAt = now;
  thread.readAt = null;
  await saveTeresaPublicThread(thread);

  const history = thread.messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(0, -1)
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
    }));

  const reply = await callTeresaPublicModel({
    history,
    userMessage: text,
  });

  const assistantMessage: TeresaPublicMessage = {
    id: randomUUID(),
    role: "assistant",
    content: reply,
    createdAt: new Date().toISOString(),
  };
  thread.messages.push(assistantMessage);
  thread.updatedAt = assistantMessage.createdAt;
  await saveTeresaPublicThread(thread);

  return thread;
}

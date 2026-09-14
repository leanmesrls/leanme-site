import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { get, list, put } from "@vercel/blob";

import type { TeresaPublicThread } from "@/types/teresa-public";

const DATA_DIR =
  process.env.TERESA_DATA_DIR ??
  (process.env.VERCEL === "1" ? "/tmp/.teresa-data" : ".teresa-data");

const BLOB_PREFIX = "teresa/threads/";

let warnedEphemeral = false;

function useBlobStore(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim()
  );
}

function warnIfEphemeralProduction() {
  if (warnedEphemeral) return;
  if (process.env.VERCEL === "1" && !useBlobStore()) {
    warnedEphemeral = true;
    console.warn(
      "[teresa-public] Nessun Vercel Blob configurato: le chat restano in /tmp e non sono visibili in Lean.Human tra una funzione e l'altra."
    );
  }
}

function rootDir(): string {
  return path.isAbsolute(DATA_DIR)
    ? DATA_DIR
    : path.join(process.cwd(), DATA_DIR);
}

function threadsDir(): string {
  return path.join(rootDir(), "threads");
}

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function fsThreadPath(id: string): string {
  return path.join(threadsDir(), `${safeId(id)}.json`);
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${safeId(id)}.json`;
}

async function ensureDir() {
  await mkdir(threadsDir(), { recursive: true });
}

function sortThreads(threads: TeresaPublicThread[]): TeresaPublicThread[] {
  return threads.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

async function listAllBlobPathnames(prefix: string): Promise<string[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      if (blob.pathname.endsWith(".json")) {
        pathnames.push(blob.pathname);
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return pathnames;
}

async function readJsonBlob(
  pathname: string
): Promise<TeresaPublicThread | null> {
  try {
    const result = await get(pathname, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) return null;
    return (await new Response(result.stream).json()) as TeresaPublicThread;
  } catch {
    return null;
  }
}

async function listThreadsFromBlob(): Promise<TeresaPublicThread[]> {
  const pathnames = await listAllBlobPathnames(BLOB_PREFIX);
  const threads = await Promise.all(pathnames.map((pathname) => readJsonBlob(pathname)));
  return sortThreads(
    threads.filter((thread): thread is TeresaPublicThread => Boolean(thread))
  );
}

async function getThreadFromBlob(
  id: string
): Promise<TeresaPublicThread | null> {
  return readJsonBlob(blobPath(id));
}

async function saveThreadToBlob(thread: TeresaPublicThread): Promise<void> {
  await put(blobPath(thread.id), JSON.stringify(thread), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

async function listThreadsFromFs(): Promise<TeresaPublicThread[]> {
  await ensureDir();
  const files = await readdir(threadsDir()).catch(() => [] as string[]);
  const threads = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        try {
          const raw = await readFile(path.join(threadsDir(), file), "utf8");
          return JSON.parse(raw) as TeresaPublicThread;
        } catch {
          return null;
        }
      })
  );
  return sortThreads(
    threads.filter((thread): thread is TeresaPublicThread => Boolean(thread))
  );
}

async function getThreadFromFs(id: string): Promise<TeresaPublicThread | null> {
  try {
    const raw = await readFile(fsThreadPath(id), "utf8");
    return JSON.parse(raw) as TeresaPublicThread;
  } catch {
    return null;
  }
}

async function saveThreadToFs(thread: TeresaPublicThread): Promise<void> {
  await ensureDir();
  await writeFile(
    fsThreadPath(thread.id),
    JSON.stringify(thread, null, 2),
    "utf8"
  );
}

export async function listTeresaPublicThreads(): Promise<TeresaPublicThread[]> {
  warnIfEphemeralProduction();
  if (useBlobStore()) {
    return listThreadsFromBlob();
  }
  return listThreadsFromFs();
}

export async function getTeresaPublicThread(
  id: string
): Promise<TeresaPublicThread | null> {
  warnIfEphemeralProduction();
  if (useBlobStore()) {
    return getThreadFromBlob(id);
  }
  return getThreadFromFs(id);
}

export async function saveTeresaPublicThread(
  thread: TeresaPublicThread
): Promise<void> {
  warnIfEphemeralProduction();
  if (useBlobStore()) {
    await saveThreadToBlob(thread);
    return;
  }
  await saveThreadToFs(thread);
}

export async function createTeresaPublicThread(
  visitorId: string
): Promise<TeresaPublicThread> {
  const now = new Date().toISOString();
  const thread: TeresaPublicThread = {
    id: `pub_${randomUUID()}`,
    visitorId,
    source: "public_site",
    lead: null,
    messages: [],
    createdAt: now,
    updatedAt: now,
    notifiedAt: null,
    readAt: null,
  };
  await saveTeresaPublicThread(thread);
  return thread;
}

export async function listTeresaPublicThreadsForVisitor(
  visitorId: string
): Promise<TeresaPublicThread[]> {
  const threads = await listTeresaPublicThreads();
  return threads.filter((thread) => thread.visitorId === visitorId);
}

export async function findLatestThreadForVisitor(
  visitorId: string
): Promise<TeresaPublicThread | null> {
  const threads = await listTeresaPublicThreadsForVisitor(visitorId);
  return threads[0] ?? null;
}

export function isTeresaInboxThread(thread: TeresaPublicThread): boolean {
  if (thread.lead) return true;
  return thread.messages.some(
    (message) => message.role === "user" || message.role === "assistant"
  );
}

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { TeresaPublicThread } from "@/types/teresa-public";

const DATA_DIR =
  process.env.TERESA_DATA_DIR ??
  (process.env.VERCEL === "1" ? "/tmp/.teresa-data" : ".teresa-data");

function rootDir(): string {
  return path.isAbsolute(DATA_DIR)
    ? DATA_DIR
    : path.join(process.cwd(), DATA_DIR);
}

function threadsDir(): string {
  return path.join(rootDir(), "threads");
}

function threadPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(threadsDir(), `${safe}.json`);
}

async function ensureDir() {
  await mkdir(threadsDir(), { recursive: true });
}

export async function listTeresaPublicThreads(): Promise<TeresaPublicThread[]> {
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
  return threads
    .filter((thread): thread is TeresaPublicThread => Boolean(thread))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function getTeresaPublicThread(
  id: string
): Promise<TeresaPublicThread | null> {
  try {
    const raw = await readFile(threadPath(id), "utf8");
    return JSON.parse(raw) as TeresaPublicThread;
  } catch {
    return null;
  }
}

export async function saveTeresaPublicThread(
  thread: TeresaPublicThread
): Promise<void> {
  await ensureDir();
  await writeFile(threadPath(thread.id), JSON.stringify(thread, null, 2), "utf8");
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

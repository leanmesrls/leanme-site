import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { get, put } from "@vercel/blob";

export const REBUILD_VISIT_BASE = 184;
const BLOB_PATH = "rebuild/visits.json";

const DATA_DIR =
  process.env.REBUILD_DATA_DIR ??
  (process.env.VERCEL === "1" ? "/tmp/.rebuild-data" : ".rebuild-data");

function blobStoreEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() || process.env.BLOB_STORE_ID?.trim()
  );
}

function filePath(): string {
  const root = path.isAbsolute(DATA_DIR) ? DATA_DIR : path.join(process.cwd(), DATA_DIR);
  return path.join(root, "visits.json");
}

function parseCount(raw: string): number {
  try {
    const data = JSON.parse(raw) as { count?: unknown };
    return typeof data.count === "number" && data.count >= 0 ? Math.floor(data.count) : 0;
  } catch {
    return 0;
  }
}

async function readCount(): Promise<number> {
  if (blobStoreEnabled()) {
    try {
      const result = await get(BLOB_PATH, { access: "private", useCache: false });
      if (!result?.stream) return 0;
      return parseCount(await new Response(result.stream).text());
    } catch {
      return 0;
    }
  }
  try {
    return parseCount(await readFile(filePath(), "utf8"));
  } catch {
    return 0;
  }
}

async function writeCount(count: number): Promise<void> {
  const body = JSON.stringify({ count });
  if (blobStoreEnabled()) {
    await put(BLOB_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    return;
  }
  const target = filePath();
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, body, "utf8");
}

export function isRebuildVisitBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse/i.test(
    userAgent
  );
}

export async function rebuildVisitTotal(countThisVisit: boolean): Promise<number> {
  const current = await readCount();
  if (!countThisVisit) return REBUILD_VISIT_BASE + current;
  const next = current + 1;
  await writeCount(next);
  return REBUILD_VISIT_BASE + next;
}

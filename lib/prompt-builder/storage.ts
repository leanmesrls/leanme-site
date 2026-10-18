import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { get, list, put } from "@vercel/blob";

import type { BuilderProfile } from "@/lib/prompt-builder/types";

const DATA_DIR =
  process.env.PROMPT_BUILDER_DATA_DIR ??
  (process.env.VERCEL === "1" ? "/tmp/.prompt-builder-data" : ".prompt-builder-data");

const BLOB_PREFIX = "prompt-builder/profiles/";

function blobStoreEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim()
  );
}

function rootDir(): string {
  return path.isAbsolute(DATA_DIR)
    ? DATA_DIR
    : path.join(process.cwd(), DATA_DIR);
}

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function filePath(id: string): string {
  return path.join(rootDir(), `${safeId(id)}.json`);
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${safeId(id)}.json`;
}

async function readBlob(pathname: string): Promise<BuilderProfile | null> {
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result?.stream) return null;
    return (await new Response(result.stream).json()) as BuilderProfile;
  } catch {
    return null;
  }
}

async function listBlob(): Promise<BuilderProfile[]> {
  const profiles: BuilderProfile[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
    const batch = await Promise.all(
      page.blobs
        .filter((blob) => blob.pathname.endsWith(".json"))
        .map((blob) => readBlob(blob.pathname))
    );
    for (const profile of batch) {
      if (profile) profiles.push(profile);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return profiles.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getBuilderProfile(
  id: string
): Promise<BuilderProfile | null> {
  if (blobStoreEnabled()) return readBlob(blobPath(id));
  try {
    const raw = await readFile(filePath(id), "utf8");
    return JSON.parse(raw) as BuilderProfile;
  } catch {
    return null;
  }
}

export async function saveBuilderProfile(profile: BuilderProfile): Promise<void> {
  profile.updatedAt = new Date().toISOString();
  const body = JSON.stringify(profile);
  if (blobStoreEnabled()) {
    await put(blobPath(profile.id), body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await mkdir(rootDir(), { recursive: true });
  await writeFile(filePath(profile.id), body, "utf8");
}

export async function listBuilderProfiles(): Promise<BuilderProfile[]> {
  if (blobStoreEnabled()) return listBlob();
  await mkdir(rootDir(), { recursive: true });
  const files = await readdir(rootDir()).catch(() => [] as string[]);
  const profiles = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        try {
          const raw = await readFile(path.join(rootDir(), file), "utf8");
          return JSON.parse(raw) as BuilderProfile;
        } catch {
          return null;
        }
      })
  );
  return profiles
    .filter((profile): profile is BuilderProfile => Boolean(profile))
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export function newProfileId(): string {
  return `pb_${randomUUID()}`;
}

export function newRunId(): string {
  return `run_${randomUUID()}`;
}

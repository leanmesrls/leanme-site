import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { get, put } from "@vercel/blob";

export interface InterestVote {
  voterId: string;
  slug: string;
  stars: number;
  updatedAt: string;
}

const DATA_DIR =
  process.env.LEANLAB_DATA_DIR ??
  (process.env.VERCEL === "1" ? "/tmp/.leanlab-data" : ".leanlab-data");

const BLOB_PATH = "leanlab/interest-votes.json";

function blobStoreEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim()
  );
}

function filePath(): string {
  const root = path.isAbsolute(DATA_DIR)
    ? DATA_DIR
    : path.join(process.cwd(), DATA_DIR);
  return path.join(root, "interest-votes.json");
}

function parseVotes(raw: string): InterestVote[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item): item is InterestVote =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as InterestVote).voterId === "string" &&
        typeof (item as InterestVote).slug === "string" &&
        typeof (item as InterestVote).stars === "number"
    );
  } catch {
    return [];
  }
}

async function readVotes(): Promise<InterestVote[]> {
  if (blobStoreEnabled()) {
    try {
      const result = await get(BLOB_PATH, { access: "private", useCache: false });
      if (!result?.stream) return [];
      return parseVotes(await new Response(result.stream).text());
    } catch {
      return [];
    }
  }
  try {
    return parseVotes(await readFile(filePath(), "utf8"));
  } catch {
    return [];
  }
}

async function writeVotes(votes: InterestVote[]): Promise<void> {
  const body = JSON.stringify(votes);
  if (blobStoreEnabled()) {
    await put(BLOB_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  const target = filePath();
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, body, "utf8");
}

export async function getInterestVote(
  voterId: string,
  slug: string
): Promise<number | null> {
  const votes = await readVotes();
  const found = votes.find((vote) => vote.voterId === voterId && vote.slug === slug);
  return found?.stars ?? null;
}

export async function saveInterestVote(
  voterId: string,
  slug: string,
  stars: number
): Promise<void> {
  const votes = await readVotes();
  const next: InterestVote = {
    voterId,
    slug,
    stars,
    updatedAt: new Date().toISOString(),
  };
  const index = votes.findIndex(
    (vote) => vote.voterId === voterId && vote.slug === slug
  );
  if (index >= 0) votes[index] = next;
  else votes.push(next);
  await writeVotes(votes);
}

export async function listInterestVotes(): Promise<InterestVote[]> {
  return readVotes();
}

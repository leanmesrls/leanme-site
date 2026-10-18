import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { getLeanLabArticle } from "@/lib/content";
import {
  getInterestVote,
  saveInterestVote,
} from "@/lib/leanlab/interest-store";

export const runtime = "nodejs";

const COOKIE = "leanlab_interest_id";

function readVoterId(request: Request): { id: string; fresh: boolean } {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(/(?:^|;\s*)leanlab_interest_id=([^;]+)/);
  const current = match ? decodeURIComponent(match[1]) : "";
  if (/^[a-zA-Z0-9_-]{8,80}$/.test(current)) {
    return { id: current, fresh: false };
  }
  return { id: randomUUID(), fresh: true };
}

function withVoter(response: NextResponse, voterId: string, fresh: boolean) {
  if (!fresh) return response;
  response.cookies.set(COOKIE, voterId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug || !getLeanLabArticle(slug)) {
    return NextResponse.json({ stars: null });
  }
  const voter = readVoterId(request);
  const stars = await getInterestVote(voter.id, slug);
  return withVoter(NextResponse.json({ stars }), voter.id, voter.fresh);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    slug?: unknown;
    stars?: unknown;
  } | null;
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const stars = body?.stars;
  if (!slug || !getLeanLabArticle(slug)) {
    return NextResponse.json({ error: "Articolo non trovato." }, { status: 404 });
  }
  if (typeof stars !== "number" || !Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Scegli da 1 a 5." }, { status: 400 });
  }
  const voter = readVoterId(request);
  await saveInterestVote(voter.id, slug, stars);
  return withVoter(NextResponse.json({ ok: true, stars }), voter.id, voter.fresh);
}

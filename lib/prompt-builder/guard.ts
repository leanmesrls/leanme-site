import { NextResponse } from "next/server";

import { builderProfileIdFromCookies } from "@/lib/prompt-builder/session";
import { getBuilderProfile } from "@/lib/prompt-builder/storage";
import type { BuilderProfile } from "@/lib/prompt-builder/types";
import { builderIsOpen } from "@/lib/prompt-builder/window";

export const QUESTION_LIMIT = 24;
export const COMPOSE_LIMIT = 12;

export async function requireProfile(): Promise<
  { profile: BuilderProfile } | { response: NextResponse }
> {
  if (!builderIsOpen()) {
    return {
      response: NextResponse.json(
        { error: "La beta gratuita è conclusa." },
        { status: 403 }
      ),
    };
  }
  const id = await builderProfileIdFromCookies();
  if (!id) {
    return {
      response: NextResponse.json({ error: "Accesso mancante." }, { status: 401 }),
    };
  }
  const profile = await getBuilderProfile(id);
  if (!profile) {
    return {
      response: NextResponse.json({ error: "Accesso mancante." }, { status: 401 }),
    };
  }
  return { profile };
}

export function rollQuestionWindow(profile: BuilderProfile): void {
  const start = new Date(profile.windowStart).getTime();
  if (!Number.isFinite(start) || Date.now() - start > 60 * 60 * 1000) {
    profile.windowStart = new Date().toISOString();
    profile.questionCalls = 0;
  }
}

export function clipText(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

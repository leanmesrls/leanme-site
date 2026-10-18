import { NextResponse } from "next/server";

import { clipText, validEmail } from "@/lib/prompt-builder/guard";
import {
  builderCookieOptions,
  PROMPT_BUILDER_COOKIE,
  signBuilderSession,
} from "@/lib/prompt-builder/session";
import {
  getBuilderProfile,
  newProfileId,
  saveBuilderProfile,
} from "@/lib/prompt-builder/storage";
import type { BuilderProfile } from "@/lib/prompt-builder/types";
import { builderIsOpen } from "@/lib/prompt-builder/window";
import { builderProfileIdFromCookies } from "@/lib/prompt-builder/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!builderIsOpen()) {
    return NextResponse.json(
      { error: "La beta gratuita è conclusa." },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    privacyAccepted?: unknown;
    marketingOptIn?: unknown;
  } | null;

  const name = clipText(body?.name, 80);
  const email = clipText(body?.email, 254).toLowerCase();
  if (name.length < 2) {
    return NextResponse.json({ error: "Scrivi il tuo nome." }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ error: "Scrivi un'email valida." }, { status: 400 });
  }
  if (body?.privacyAccepted !== true) {
    return NextResponse.json(
      { error: "Per entrare serve l'informativa privacy." },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const marketing = body?.marketingOptIn === true;
  const currentId = await builderProfileIdFromCookies();
  const current = currentId ? await getBuilderProfile(currentId) : null;

  const profile: BuilderProfile = current
    ? {
        ...current,
        name,
        email,
        marketingOptIn: marketing,
        marketingOptInAt: marketing ? current.marketingOptInAt ?? now : null,
      }
    : {
        id: newProfileId(),
        name,
        email,
        privacyAcceptedAt: now,
        marketingOptIn: marketing,
        marketingOptInAt: marketing ? now : null,
        createdAt: now,
        updatedAt: now,
        questionCalls: 0,
        composeCount: 0,
        windowStart: now,
        draft: null,
        runs: [],
      };

  await saveBuilderProfile(profile);

  const token = await signBuilderSession(profile.id);
  const response = NextResponse.json({
    ok: true,
    name: profile.name,
  });
  response.cookies.set(PROMPT_BUILDER_COOKIE, token, builderCookieOptions());
  return response;
}

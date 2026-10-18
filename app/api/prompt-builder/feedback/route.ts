import { NextResponse } from "next/server";

import { clipText, requireProfile } from "@/lib/prompt-builder/guard";
import { saveBuilderProfile } from "@/lib/prompt-builder/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const access = await requireProfile();
  if ("response" in access) return access.response;
  const { profile } = access;

  const body = (await request.json().catch(() => null)) as {
    runId?: unknown;
    type?: unknown;
    feedback?: unknown;
    note?: unknown;
  } | null;

  const run = profile.runs.find((item) => item.id === body?.runId);
  if (!run) {
    return NextResponse.json({ error: "Prompt non trovato." }, { status: 404 });
  }

  if (body?.type === "copy") {
    run.copiedAt = new Date().toISOString();
  } else if (body?.type === "feedback") {
    if (body.feedback !== "utile" && body.feedback !== "da_rifare") {
      return NextResponse.json({ error: "Scegli un feedback." }, { status: 400 });
    }
    run.feedback = body.feedback;
    run.feedbackNote = clipText(body.note, 280);
  } else {
    return NextResponse.json({ error: "Azione non valida." }, { status: 400 });
  }

  await saveBuilderProfile(profile);
  return NextResponse.json({ ok: true });
}

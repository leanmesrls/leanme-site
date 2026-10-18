import { NextResponse } from "next/server";

import { clipText, COMPOSE_LIMIT, requireProfile } from "@/lib/prompt-builder/guard";
import { composePrompt } from "@/lib/prompt-builder/model";
import { newRunId, saveBuilderProfile } from "@/lib/prompt-builder/storage";
import type { LabAnswer } from "@/lib/prompt-builder/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const access = await requireProfile();
  if ("response" in access) return access.response;
  const { profile } = access;

  if (profile.composeCount >= COMPOSE_LIMIT) {
    return NextResponse.json(
      { error: "Hai raggiunto il numero di prompt di questa beta." },
      { status: 429 }
    );
  }
  if (!profile.draft) {
    return NextResponse.json(
      { error: "Prima serve l'idea di partenza." },
      { status: 400 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    answers?: Array<{ id?: unknown; value?: unknown }>;
  } | null;

  const answers: LabAnswer[] = [];
  for (const question of profile.draft.questions) {
    const raw = body?.answers?.find((item) => item.id === question.id);
    const value = clipText(raw?.value, 200);
    if (value.length < 2) {
      return NextResponse.json(
        { error: "Rispondi a tutte le domande, anche con una frase breve." },
        { status: 400 }
      );
    }
    answers.push({ id: question.id, value });
  }

  try {
    const composed = await composePrompt({
      idea: profile.draft.idea,
      category: profile.draft.category,
      answers: answers.map((answer) => ({
        question:
          profile.draft?.questions.find((question) => question.id === answer.id)
            ?.prompt ?? answer.id,
        value: answer.value,
      })),
    });

    const run = {
      id: newRunId(),
      idea: profile.draft.idea,
      category: profile.draft.category,
      questions: profile.draft.questions,
      answers,
      prompt: composed.prompt,
      parts: composed.parts,
      why: composed.why,
      toolId: composed.toolId,
      toolBecause: composed.toolBecause,
      alternatives: composed.alternatives,
      createdAt: new Date().toISOString(),
      copiedAt: null,
      feedback: null,
      feedbackNote: "",
    };
    profile.composeCount += 1;
    profile.runs = [run, ...profile.runs].slice(0, 30);
    profile.draft = null;
    await saveBuilderProfile(profile);

    return NextResponse.json({
      runId: run.id,
      idea: run.idea,
      prompt: run.prompt,
      parts: run.parts,
      why: run.why,
      toolId: run.toolId,
      toolBecause: run.toolBecause,
      alternatives: run.alternatives,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "OPENAI_API_KEY_MISSING") {
      return NextResponse.json(
        { error: "Il laboratorio non è collegato al modello." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Non sono riuscito a scrivere il prompt. Riprova." },
      { status: 502 }
    );
  }
}

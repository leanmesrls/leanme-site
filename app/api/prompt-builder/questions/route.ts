import { NextResponse } from "next/server";

import {
  clipText,
  QUESTION_LIMIT,
  requireProfile,
  rollQuestionWindow,
} from "@/lib/prompt-builder/guard";
import { planQuestions } from "@/lib/prompt-builder/model";
import { saveBuilderProfile } from "@/lib/prompt-builder/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const access = await requireProfile();
  if ("response" in access) return access.response;
  const { profile } = access;

  rollQuestionWindow(profile);
  if (profile.questionCalls >= QUESTION_LIMIT) {
    return NextResponse.json(
      { error: "Hai raggiunto il limite di prove per questa ora." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => null)) as { idea?: unknown } | null;
  const idea = clipText(body?.idea, 600);
  if (idea.length < 8) {
    return NextResponse.json(
      { error: "Racconta l'idea in una frase, almeno qualche parola." },
      { status: 400 }
    );
  }

  try {
    const plan = await planQuestions(idea);
    profile.questionCalls += 1;
    profile.draft = {
      idea,
      category: plan.category,
      angela: plan.angela,
      questions: plan.questions,
    };
    await saveBuilderProfile(profile);
    return NextResponse.json({
      category: plan.category,
      ready: plan.ready,
      angela: plan.angela,
      questions: plan.questions,
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
      { error: "Non sono riuscito a preparare le domande. Riprova." },
      { status: 502 }
    );
  }
}

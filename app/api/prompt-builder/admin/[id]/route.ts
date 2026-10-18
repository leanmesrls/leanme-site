import { NextResponse } from "next/server";

import { getLeanHumanSessionFromCookies } from "@/lib/teresa-public/admin-auth";
import { getBuilderProfile } from "@/lib/prompt-builder/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const ok = await getLeanHumanSessionFromCookies();
  if (!ok) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await context.params;
  const profile = await getBuilderProfile(id);
  if (!profile) {
    return NextResponse.json({ error: "Scheda non trovata." }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      marketingOptIn: profile.marketingOptIn,
      createdAt: profile.createdAt,
      runs: profile.runs.map((run) => ({
        id: run.id,
        idea: run.idea,
        category: run.category,
        questions: run.questions.map((question) => ({
          prompt: question.prompt,
          value:
            run.answers.find((answer) => answer.id === question.id)?.value ?? "",
        })),
        prompt: run.prompt,
        toolId: run.toolId,
        toolBecause: run.toolBecause,
        createdAt: run.createdAt,
        copiedAt: run.copiedAt,
        feedback: run.feedback,
        feedbackNote: run.feedbackNote,
      })),
    },
  });
}

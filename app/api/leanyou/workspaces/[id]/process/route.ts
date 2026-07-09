import { NextResponse } from "next/server";

import {
  processLeonardoWorkspace,
  transcribeAudioBuffer,
} from "@/lib/leanyou/leonardo-processor";
import { cleanFullTranscript } from "@/lib/leanyou/transcription-cleanup";
import { tenantHasModule } from "@/lib/leanyou/auth";
import {
  forbiddenResponse,
  requireSession,
} from "@/lib/leanyou/server-auth";
import type { LeonardoProcessRequestBody } from "@/lib/leanyou/upload-payload";
import {
  decodeUploadFile,
  isMediaFileName,
  isTextFileName,
} from "@/lib/leanyou/upload-payload";
import {
  getWorkspace,
  saveWorkspace,
  updateWorkspaceStatus,
} from "@/lib/leanyou/workspaces";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const runtime = "nodejs";

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (!tenantHasModule(session, "leonardo")) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    const workspace = await getWorkspace(session.tenantId, id);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace non trovato." }, { status: 404 });
    }

    await updateWorkspaceStatus(session.tenantId, id, "processing", {
      errorMessage: null,
    });

    let transcript = workspace.transcript.trim();
    const body = (await request.json()) as LeonardoProcessRequestBody;

    if (body.transcript?.trim()) {
      transcript = body.transcript.trim();
    }

    if (body.file) {
      const buffer = decodeUploadFile(body.file);

      if (isTextFileName(body.file.name)) {
        transcript = buffer.toString("utf8").trim();
      } else if (isMediaFileName(body.file.name)) {
        transcript = await transcribeAudioBuffer(
          buffer,
          body.file.name,
          body.file.mimeType
        );
      } else {
        throw new Error(
          "Formato non supportato. Usa txt/vtt/srt oppure mp3/m4a/wav/mp4/webm/mov."
        );
      }
    }

    if (!transcript) {
      await updateWorkspaceStatus(session.tenantId, id, "failed", {
        errorMessage: "Nessuna trascrizione disponibile.",
      });
      return NextResponse.json(
        { error: "Carica un file o aggiungi informazioni testuali." },
        { status: 400 }
      );
    }

    transcript = cleanFullTranscript(transcript);

    const workspaceContext = [
      `Titolo: ${workspace.title}`,
      `Cliente: ${workspace.client}`,
      `Organizzazione: ${workspace.organization}`,
      `Data: ${workspace.meetingDate}`,
      `Tipo: ${workspace.meetingType}`,
      `Partecipanti: ${workspace.participants}`,
      `Moderatore: ${workspace.moderator}`,
      `Segretario: ${workspace.secretary}`,
      `Note: ${workspace.notes}`,
    ].join("\n");

    const result = await processLeonardoWorkspace({
      meetingType: workspace.meetingType,
      workspaceContext,
      transcript,
      workspace: {
        title: workspace.title,
        meetingDate: workspace.meetingDate,
        participants: workspace.participants,
        client: workspace.client,
        organization: workspace.organization,
      },
    });

    const completed = {
      ...workspace,
      transcript,
      structured: result.structured,
      documents: result.documents,
      status: "completed" as const,
      errorMessage: null,
      updatedAt: new Date().toISOString(),
    };

    await saveWorkspace(completed);
    return NextResponse.json({ workspace: completed });
  } catch (error) {
    const { id } = await context.params;
    const session = await getSessionSafe();
    const message =
      error instanceof Error ? error.message : "Elaborazione non riuscita.";

    if (session) {
      await updateWorkspaceStatus(session.tenantId, id, "failed", {
        errorMessage: message,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getSessionSafe() {
  try {
    return await requireSession();
  } catch {
    return null;
  }
}

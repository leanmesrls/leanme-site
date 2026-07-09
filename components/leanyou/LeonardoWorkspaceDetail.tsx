"use client";

import Link from "next/link";
import { useState } from "react";

import configData from "@/data/leanyou/config.json";
import { LeonardoWorkspaceMetadataForm } from "@/components/leanyou/LeonardoWorkspaceMetadataForm";
import {
  prepareMediaForTranscription,
  type MediaPrepProgress,
} from "@/lib/leanyou/ffmpeg-client";
import { mergeTranscriptParts } from "@/lib/leanyou/transcription-merge";
import { combineTranscriptSources } from "@/lib/leanyou/transcription-cleanup";
import {
  blobToBase64,
  isTextFileName,
} from "@/lib/leanyou/upload-payload";
import { leanyouLeonardoPath } from "@/lib/leanyou/paths";
import type { LeanYouConfig, LeonardoWorkspace } from "@/types/leanyou";

const config = configData as LeanYouConfig;

interface LeonardoWorkspaceDetailProps {
  tenantSlug: string;
  initialWorkspace: LeonardoWorkspace;
}

export function LeonardoWorkspaceDetail({
  tenantSlug,
  initialWorkspace,
}: LeonardoWorkspaceDetailProps) {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [supplementalText, setSupplementalText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<MediaPrepProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState(
    config.leonardo.documentTypes[0]?.id ?? "integral_transcript"
  );

  async function transcribeAudioPart(
    name: string,
    mimeType: string,
    blob: Blob
  ): Promise<string> {
    const response = await fetch(
      `/api/leanyou/workspaces/${workspace.id}/transcribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: {
            name,
            mimeType,
            dataBase64: await blobToBase64(blob),
          },
        }),
      }
    );

    const result = (await response.json()) as { error?: string; text?: string };
    if (!response.ok) {
      throw new Error(result.error ?? "Trascrizione non riuscita.");
    }

    return result.text?.trim() ?? "";
  }

  async function resolveTranscriptFromFile(selectedFile: File): Promise<string> {
    if (isTextFileName(selectedFile.name)) {
      return (await selectedFile.text()).trim();
    }

    const prepared = await prepareMediaForTranscription(selectedFile, setProgress);

    if (prepared.mode === "direct") {
      setProgress({
        stage: "ready",
        message: "Trascrizione audio in corso...",
        percent: 100,
      });
      return transcribeAudioPart(
        prepared.file.name,
        prepared.file.type || "audio/mp4",
        prepared.file
      );
    }

    const parts: string[] = [];
    for (const chunk of prepared.chunks) {
      setProgress({
        stage: "ready",
        message: `Trascrizione parte ${chunk.index}/${chunk.total}...`,
        percent: Math.round((chunk.index / chunk.total) * 100),
      });
      const part = await transcribeAudioPart(
        chunk.name,
        chunk.mimeType,
        chunk.blob
      );
      if (part) {
        parts.push(part);
      }
    }

    return mergeTranscriptParts(parts);
  }

  async function handleProcess() {
    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      let videoTranscript = "";

      if (file) {
        videoTranscript = await resolveTranscriptFromFile(file);
      }

      const finalTranscript = combineTranscriptSources(
        videoTranscript,
        supplementalText
      );

      if (!finalTranscript) {
        setError("Carica un video/audio o aggiungi informazioni testuali.");
        setLoading(false);
        return;
      }

      setProgress({
        stage: "ready",
        message: "Generazione verbali e documenti...",
        percent: 100,
      });

      const response = await fetch(
        `/api/leanyou/workspaces/${workspace.id}/process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: finalTranscript }),
        }
      );

      let result: { error?: string; workspace?: LeonardoWorkspace };
      try {
        result = (await response.json()) as {
          error?: string;
          workspace?: LeonardoWorkspace;
        };
      } catch {
        setLoading(false);
        setProgress(null);
        setError("Risposta non valida dal server.");
        return;
      }

      setLoading(false);
      setProgress(null);

      if (!response.ok || !result.workspace) {
        setError(result.error ?? "Elaborazione non riuscita.");
        setWorkspace((current) => ({
          ...current,
          status: "failed",
          errorMessage: result.error ?? "Elaborazione non riuscita.",
        }));
        return;
      }

      setWorkspace(result.workspace);
    } catch (uploadError) {
      setLoading(false);
      setProgress(null);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Elaborazione non riuscita."
      );
    }
  }

  function downloadDocument(documentId: string) {
    const content = workspace.documents[documentId];
    if (!content) {
      return;
    }

    const blob = new Blob([content], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${workspace.title}-${documentId}.doc`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const progressLabel = progress?.message ?? null;
  const activeDocument = workspace.documents[activeDoc];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={leanyouLeonardoPath(tenantSlug)}
            className="text-xs font-semibold uppercase tracking-[0.1em] text-leanme-fuchsia"
          >
            ← Torna ai workspace
          </Link>
          <h2 className="mt-3 text-2xl font-bold">{workspace.title}</h2>
          <p className="mt-2 text-sm text-white/60">
            {workspace.client} · {workspace.meetingDate} · {workspace.status}
          </p>
        </div>
      </div>

      <LeonardoWorkspaceMetadataForm
        key={`${workspace.id}-${workspace.updatedAt}`}
        workspace={workspace}
        onUpdated={setWorkspace}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="space-y-4 rounded-xl border border-white/10 bg-[#111111] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-leanme-fuchsia">
            Input
          </h3>
          <p className="text-sm text-white/60">
            Carica registrazioni Zoom fino a 2 GB oppure aggiungi informazioni
            testuali. Se inserisci entrambi, Leonardo integrerà video e note
            nel verbale.
          </p>
          <input
            type="file"
            accept=".txt,.vtt,.srt,.mp3,.m4a,.wav,.mp4,.webm,.mov,.mkv,.avi,audio/*,video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-leanme-fuchsia file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-white"
          />
          {file ? (
            <p className="text-xs text-white/50">
              File selezionato: {file.name} (
              {(file.size / (1024 * 1024)).toFixed(1)} MB)
            </p>
          ) : null}
          <div>
            <label
              htmlFor="supplemental-text"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55"
            >
              Informazioni testuali
            </label>
            <textarea
              id="supplemental-text"
              value={supplementalText}
              onChange={(event) => setSupplementalText(event.target.value)}
              rows={10}
              placeholder="Aggiungi informazioni testuali..."
              className="mt-2 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm outline-none focus:border-leanme-fuchsia"
            />
          </div>
          {progressLabel ? (
            <div className="space-y-2 rounded-lg border border-leanme-fuchsia/30 bg-leanme-fuchsia/10 px-4 py-3">
              <p className="text-sm text-white/90">{progressLabel}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-leanme-fuchsia transition-all duration-300"
                  style={{ width: `${progress?.percent ?? 0}%` }}
                />
              </div>
            </div>
          ) : null}
          {error || workspace.errorMessage ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error ?? workspace.errorMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleProcess}
            disabled={loading || workspace.status === "processing"}
            className="rounded-full bg-leanme-fuchsia px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-leanme-fuchsia-dark disabled:opacity-60"
          >
            {loading || workspace.status === "processing"
              ? progressLabel ?? "Elaborazione in corso..."
              : "Genera verbali"}
          </button>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111111] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-leanme-fuchsia">
            Documenti generati
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.leonardo.documentTypes.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveDoc(doc.id)}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                  activeDoc === doc.id
                    ? "bg-leanme-fuchsia text-white"
                    : "border border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => downloadDocument(activeDoc)}
              disabled={!activeDocument}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:border-white disabled:opacity-40"
            >
              Scarica Word
            </button>
          </div>

          {activeDocument ? (
            <iframe
              title={activeDoc}
              srcDoc={activeDocument}
              className="mt-4 h-[520px] w-full rounded-lg border border-white/10 bg-white"
            />
          ) : (
            <p className="mt-4 rounded-lg border border-white/10 bg-black p-4 text-sm text-white/60">
              Nessun documento generato. Avvia l&apos;elaborazione per ottenere
              i verbali.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

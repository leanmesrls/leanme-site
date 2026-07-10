import { randomUUID } from "node:crypto";

import type {
  LeonardoWorkspace,
  LeonardoWorkspaceStatus,
  LeanYouSession,
} from "@/types/leanyou";

import {
  deleteStoredWorkspace,
  getStoredWorkspace,
  listStoredWorkspaces,
  saveStoredWorkspace,
} from "./workspace-storage";

export async function listWorkspaces(
  tenantId: string
): Promise<LeonardoWorkspace[]> {
  const workspaces = await listStoredWorkspaces(tenantId);

  return workspaces.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getWorkspace(
  tenantId: string,
  workspaceId: string
): Promise<LeonardoWorkspace | null> {
  return getStoredWorkspace(tenantId, workspaceId);
}

export async function saveWorkspace(
  workspace: LeonardoWorkspace
): Promise<void> {
  await saveStoredWorkspace(workspace);
}

export async function deleteWorkspace(
  tenantId: string,
  workspaceId: string
): Promise<void> {
  await deleteStoredWorkspace(tenantId, workspaceId);
}

export function createWorkspace(
  session: LeanYouSession,
  input: {
    title: string;
    client: string;
    organization: string;
    meetingDate: string;
    meetingType: LeonardoWorkspace["meetingType"];
    tags: string[];
    participants: string;
    moderator: string;
    secretary: string;
    notes: string;
    transcript?: string;
  }
): LeonardoWorkspace {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    tenantId: session.tenantId,
    createdBy: session.userId,
    title: input.title.trim(),
    client: input.client.trim(),
    organization: input.organization.trim(),
    meetingDate: input.meetingDate,
    meetingType: input.meetingType,
    tags: input.tags,
    participants: input.participants.trim(),
    moderator: input.moderator.trim(),
    secretary: input.secretary.trim(),
    notes: input.notes.trim(),
    status: input.transcript?.trim() ? "content_ready" : "draft",
    transcript: input.transcript?.trim() ?? "",
    structured: null,
    documents: {},
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateWorkspaceStatus(
  tenantId: string,
  workspaceId: string,
  status: LeonardoWorkspaceStatus,
  patch: Partial<LeonardoWorkspace> = {}
): Promise<LeonardoWorkspace | null> {
  const workspace = await getWorkspace(tenantId, workspaceId);
  if (!workspace) {
    return null;
  }

  const next: LeonardoWorkspace = {
    ...workspace,
    ...patch,
    status,
    updatedAt: new Date().toISOString(),
  };

  await saveWorkspace(next);
  return next;
}

export function getDashboardStats(workspaces: LeonardoWorkspace[]) {
  return {
    total: workspaces.length,
    completed: workspaces.filter((item) => item.status === "completed").length,
    processing: workspaces.filter((item) => item.status === "processing")
      .length,
    draft: workspaces.filter((item) => item.status === "draft").length,
  };
}

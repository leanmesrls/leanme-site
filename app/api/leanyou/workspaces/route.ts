import { NextResponse } from "next/server";

import {
  auditContextFromSession,
  writeLeanYouAuditEvent,
} from "@/lib/leanyou/audit-log";
import {
  forbiddenResponse,
  requireSession,
  unauthorizedResponse,
} from "@/lib/leanyou/server-auth";
import { tenantHasModule } from "@/lib/leanyou/auth";
import {
  createWorkspace,
  listWorkspaces,
  saveWorkspace,
} from "@/lib/leanyou/workspaces";

export async function GET() {
  try {
    const session = await requireSession();
    if (!tenantHasModule(session, "leonardo")) {
      return forbiddenResponse();
    }

    const workspaces = await listWorkspaces(session.tenantId);
    return NextResponse.json({ workspaces });
  } catch {
    return unauthorizedResponse();
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (!tenantHasModule(session, "leonardo")) {
      return forbiddenResponse();
    }

    const body = (await request.json()) as {
      title?: string;
      client?: string;
      organization?: string;
      meetingDate?: string;
      meetingType?: "client_meeting" | "scientific_committee" | "internal_meeting";
      tags?: string[];
      participants?: string;
      moderator?: string;
      secretary?: string;
      notes?: string;
      transcript?: string;
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Titolo obbligatorio." }, { status: 400 });
    }

    const workspace = createWorkspace(session, {
      title: body.title,
      client: body.client ?? session.tenantName,
      organization: body.organization ?? "",
      meetingDate: body.meetingDate ?? new Date().toISOString().slice(0, 10),
      meetingType: body.meetingType ?? "client_meeting",
      tags: body.tags ?? [],
      participants: body.participants ?? "",
      moderator: body.moderator ?? "",
      secretary: body.secretary ?? session.userName,
      notes: body.notes ?? "",
      transcript: body.transcript ?? "",
    });

    await saveWorkspace(workspace);
    await writeLeanYouAuditEvent({
      action: "workspace_create",
      resourceType: "leonardo_workspace",
      resourceId: workspace.id,
      detail: workspace.title,
      ...auditContextFromSession(session),
    });
    return NextResponse.json({ workspace });
  } catch {
    return unauthorizedResponse();
  }
}

import { NextResponse } from "next/server";

import {
  forbiddenResponse,
  requireSession,
  unauthorizedResponse,
} from "@/lib/leanyou/server-auth";
import { tenantHasModule } from "@/lib/leanyou/auth";
import type { LeonardoWorkspace } from "@/types/leanyou";
import {
  deleteWorkspace,
  getWorkspace,
  saveWorkspace,
} from "@/lib/leanyou/workspaces";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
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

    return NextResponse.json({ workspace });
  } catch {
    return unauthorizedResponse();
  }
}

export async function PATCH(request: Request, context: RouteContext) {
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

    const body = (await request.json()) as Partial<LeonardoWorkspace>;
    const allowed: Partial<LeonardoWorkspace> = {
      title: body.title,
      client: body.client,
      organization: body.organization,
      meetingDate: body.meetingDate,
      meetingType: body.meetingType,
      tags: body.tags,
      participants: body.participants,
      moderator: body.moderator,
      secretary: body.secretary,
      notes: body.notes,
    };

    const next = {
      ...workspace,
      ...Object.fromEntries(
        Object.entries(allowed).filter(([, value]) => value !== undefined)
      ),
      id: workspace.id,
      tenantId: workspace.tenantId,
      createdBy: workspace.createdBy,
      createdAt: workspace.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await saveWorkspace(next);
    return NextResponse.json({ workspace: next });
  } catch {
    return unauthorizedResponse();
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

    await deleteWorkspace(session.tenantId, id);
    return NextResponse.json({ ok: true });
  } catch {
    return unauthorizedResponse();
  }
}

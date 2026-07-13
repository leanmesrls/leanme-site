import { NextResponse } from "next/server";

import {
  tenantHasLeonardoCapability,
  tenantHasModule,
} from "@/lib/leanyou/auth";
import {
  deleteEventContactAssignment,
  getAssignment,
} from "@/lib/leanyou/event-assignments";
import { getEvent } from "@/lib/leanyou/events";
import {
  forbiddenResponse,
  handleLeanYouRouteError,
  requireSession,
} from "@/lib/leanyou/server-auth";

interface RouteContext {
  params: Promise<{ id: string; assignmentId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "ospiti")
    ) {
      return forbiddenResponse();
    }

    const { id: eventId, assignmentId } = await context.params;
    const event = await getEvent(session.tenantId, eventId);
    if (!event) {
      return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
    }

    const assignment = await getAssignment(session.tenantId, assignmentId);
    if (!assignment || assignment.eventId !== eventId) {
      return NextResponse.json(
        { error: "Assegnazione non trovata." },
        { status: 404 }
      );
    }

    await deleteEventContactAssignment(session.tenantId, assignmentId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleLeanYouRouteError(
      error,
      "Rimozione assegnazione non riuscita."
    );
  }
}

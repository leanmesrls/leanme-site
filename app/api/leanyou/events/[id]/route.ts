import { NextResponse } from "next/server";

import {
  tenantHasLeonardoCapability,
  tenantHasModule,
} from "@/lib/leanyou/auth";
import {
  forbiddenResponse,
  handleLeanYouRouteError,
  requireSession,
} from "@/lib/leanyou/server-auth";
import { normalizeMeetingDateInput } from "@/lib/leanyou/dates";
import {
  isHealthFormationCategory,
  normalizeLeonardoEvent,
  validateEventTaxonomy,
} from "@/lib/leanyou/event-taxonomy";
import type { LeonardoEvent } from "@/types/leanyou";
import { deleteEvent, getEvent, saveEvent } from "@/lib/leanyou/events";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "eventi")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    const event = await getEvent(session.tenantId, id);
    if (!event) {
      return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return handleLeanYouRouteError(error, "Caricamento evento non riuscito.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "eventi")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    const event = await getEvent(session.tenantId, id);
    if (!event) {
      return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
    }

    const body = (await request.json()) as Partial<LeonardoEvent>;
    const categoryId = body.categoryId ?? event.categoryId;
    const healthAreaId =
      body.healthAreaId !== undefined ? body.healthAreaId : event.healthAreaId;
    const ecmEnabled =
      body.ecmEnabled !== undefined ? body.ecmEnabled : event.ecmEnabled;
    const ecmModality =
      body.ecmModality !== undefined ? body.ecmModality : event.ecmModality;

    const taxonomyError = validateEventTaxonomy({
      categoryId,
      healthAreaId,
      ecmEnabled,
      ecmModality,
    });
    if (taxonomyError) {
      return NextResponse.json({ error: taxonomyError }, { status: 400 });
    }

    const next = normalizeLeonardoEvent({
      ...event,
      cdc: body.cdc !== undefined ? body.cdc.trim() : event.cdc,
      title: body.title !== undefined ? body.title.trim() : event.title,
      venue: body.venue !== undefined ? body.venue.trim() : event.venue,
      startDate:
        body.startDate !== undefined
          ? normalizeMeetingDateInput(body.startDate)
          : event.startDate,
      endDate:
        body.endDate !== undefined
          ? normalizeMeetingDateInput(body.endDate)
          : event.endDate,
      categoryId,
      healthAreaId: isHealthFormationCategory(categoryId) ? healthAreaId : null,
      ecmEnabled: isHealthFormationCategory(categoryId) ? ecmEnabled : false,
      ecmModality:
        isHealthFormationCategory(categoryId) && ecmEnabled
          ? ecmModality
          : null,
      status: body.status ?? event.status,
      notes: body.notes !== undefined ? body.notes.trim() : event.notes,
      updatedAt: new Date().toISOString(),
    });

    await saveEvent(next);
    return NextResponse.json({ event: next });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_MEETING_DATE") {
      return NextResponse.json(
        { error: "Data non valida. Usa il formato gg/mm/aaaa." },
        { status: 400 }
      );
    }
    return handleLeanYouRouteError(error, "Aggiornamento evento non riuscito.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "eventi")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    await deleteEvent(session.tenantId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleLeanYouRouteError(error, "Eliminazione evento non riuscita.");
  }
}

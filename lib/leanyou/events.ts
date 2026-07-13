import { randomUUID } from "node:crypto";

import type {
  LeanYouSession,
  LeonardoEvent,
  LeonardoEventCategoryId,
  LeonardoEcmModality,
  LeonardoEventStatus,
  LeonardoEventType,
} from "@/types/leanyou";

import { normalizeMeetingDateInput } from "./dates";
import {
  isHealthFormationCategory,
  normalizeLeonardoEvent,
  validateEventTaxonomy,
} from "./event-taxonomy";
import {
  deleteStoredEvent,
  getStoredEvent,
  listStoredEvents,
  saveStoredEvent,
} from "./event-storage";

export async function listEvents(tenantId: string): Promise<LeonardoEvent[]> {
  const events = await listStoredEvents(tenantId);
  return events
    .map((event) => normalizeLeonardoEvent(event))
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function getEvent(
  tenantId: string,
  eventId: string
): Promise<LeonardoEvent | null> {
  const event = await getStoredEvent(tenantId, eventId);
  return event ? normalizeLeonardoEvent(event) : null;
}

export async function saveEvent(event: LeonardoEvent): Promise<void> {
  await saveStoredEvent(event);
}

export async function deleteEvent(
  tenantId: string,
  eventId: string
): Promise<void> {
  await deleteStoredEvent(tenantId, eventId);
}

export function createEvent(
  session: LeanYouSession,
  input: {
    cdc: string;
    title: string;
    venue: string;
    startDate: string;
    endDate: string;
    categoryId?: LeonardoEventCategoryId;
    healthAreaId?: string | null;
    ecmEnabled?: boolean | null;
    ecmModality?: LeonardoEcmModality | null;
    type?: LeonardoEventType;
    status?: LeonardoEventStatus;
    notes?: string;
  }
): LeonardoEvent {
  const now = new Date().toISOString();
  const startDate = normalizeMeetingDateInput(input.startDate);
  const endDate = normalizeMeetingDateInput(input.endDate || input.startDate);
  const categoryId =
    input.categoryId ??
    (input.type === "ecm" ? "formazione_sanitaria" : "evento_aziendale");

  const taxonomyError = validateEventTaxonomy({
    categoryId,
    healthAreaId: input.healthAreaId ?? null,
    ecmEnabled:
      input.ecmEnabled ??
      (isHealthFormationCategory(categoryId) ? null : false),
    ecmModality: input.ecmModality ?? null,
  });
  if (taxonomyError) {
    throw new Error(`INVALID_EVENT_TAXONOMY:${taxonomyError}`);
  }

  const ecmEnabled =
    input.ecmEnabled ??
    (isHealthFormationCategory(categoryId) ? null : false);

  return normalizeLeonardoEvent({
    id: randomUUID(),
    tenantId: session.tenantId,
    createdBy: session.userId,
    cdc: input.cdc.trim(),
    title: input.title.trim(),
    venue: input.venue.trim(),
    startDate,
    endDate,
    categoryId,
    healthAreaId: isHealthFormationCategory(categoryId)
      ? input.healthAreaId ?? null
      : null,
    ecmEnabled,
    ecmModality: ecmEnabled ? input.ecmModality ?? null : null,
    type: ecmEnabled ? "ecm" : "base",
    status: input.status ?? "draft",
    notes: input.notes?.trim() ?? "",
    createdAt: now,
    updatedAt: now,
  });
}

export function getEventDashboardStats(events: LeonardoEvent[]) {
  return {
    total: events.length,
    active: events.filter((event) => event.status === "active").length,
    draft: events.filter((event) => event.status === "draft").length,
    completed: events.filter((event) => event.status === "completed").length,
  };
}

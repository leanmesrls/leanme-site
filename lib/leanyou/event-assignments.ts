import { randomUUID } from "node:crypto";

import eventsConfig from "@/data/leanyou/events-config.json";
import type {
  LeanYouContact,
  LeanYouSession,
  LeonardoEventContactAssignment,
  LeonardoEventRoleCategory,
} from "@/types/leanyou";

import { getContact } from "./contacts";
import { formatContactName } from "./contact-display";
import {
  deleteStoredAssignment,
  getStoredAssignment,
  listStoredAssignments,
  saveStoredAssignment,
} from "./event-assignment-storage";

const roleCategories = eventsConfig.roleCategories as Array<{
  id: LeonardoEventRoleCategory;
  label: string;
}>;

export function getEventRoleCategoryLabel(
  roleCategory: LeonardoEventRoleCategory
): string {
  return (
    roleCategories.find((item) => item.id === roleCategory)?.label ?? roleCategory
  );
}

export function listEventRoleCategories() {
  return roleCategories;
}

export async function listAssignmentsForEvent(
  tenantId: string,
  eventId: string
): Promise<LeonardoEventContactAssignment[]> {
  const assignments = await listStoredAssignments(tenantId);
  return assignments
    .filter((assignment) => assignment.eventId === eventId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listAssignmentsForContact(
  tenantId: string,
  contactId: string
): Promise<LeonardoEventContactAssignment[]> {
  const assignments = await listStoredAssignments(tenantId);
  return assignments
    .filter((assignment) => assignment.contactId === contactId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getAssignment(
  tenantId: string,
  assignmentId: string
): Promise<LeonardoEventContactAssignment | null> {
  return getStoredAssignment(tenantId, assignmentId);
}

export function isValidRoleCategory(
  value: string
): value is LeonardoEventRoleCategory {
  return roleCategories.some((item) => item.id === value);
}

export async function createEventContactAssignment(
  session: LeanYouSession,
  input: {
    eventId: string;
    contactId: string;
    roleCategory: LeonardoEventRoleCategory;
    notes?: string;
  }
): Promise<LeonardoEventContactAssignment> {
  const contact = await getContact(session.tenantId, input.contactId);
  if (!contact) {
    throw new Error("CONTACT_NOT_FOUND");
  }

  const existing = await listAssignmentsForEvent(session.tenantId, input.eventId);
  const duplicate = existing.find(
    (assignment) =>
      assignment.contactId === input.contactId &&
      assignment.roleCategory === input.roleCategory
  );
  if (duplicate) {
    throw new Error("ASSIGNMENT_DUPLICATE");
  }

  const now = new Date().toISOString();
  const assignment: LeonardoEventContactAssignment = {
    id: randomUUID(),
    tenantId: session.tenantId,
    eventId: input.eventId,
    contactId: input.contactId,
    roleCategory: input.roleCategory,
    notes: input.notes?.trim() ?? "",
    createdAt: now,
    updatedAt: now,
  };

  await saveStoredAssignment(assignment);
  return assignment;
}

export async function deleteEventContactAssignment(
  tenantId: string,
  assignmentId: string
): Promise<void> {
  await deleteStoredAssignment(tenantId, assignmentId);
}

export type EventAssignmentWithContact = LeonardoEventContactAssignment & {
  contact: LeanYouContact;
  contactName: string;
  roleLabel: string;
};

export async function listAssignmentsForEventWithContacts(
  tenantId: string,
  eventId: string
): Promise<EventAssignmentWithContact[]> {
  const assignments = await listAssignmentsForEvent(tenantId, eventId);
  const enriched = await Promise.all(
    assignments.map(async (assignment) => {
      const contact = await getContact(tenantId, assignment.contactId);
      if (!contact) {
        return null;
      }
      return {
        ...assignment,
        contact,
        contactName: formatContactName(contact),
        roleLabel: getEventRoleCategoryLabel(assignment.roleCategory),
      };
    })
  );
  return enriched.filter(
    (item): item is EventAssignmentWithContact => item !== null
  );
}

import { randomUUID } from "node:crypto";

import type { LeanYouContact, LeanYouContactPhone, LeanYouSession } from "@/types/leanyou";

import {
  deleteStoredContact,
  findContactByEmail,
  getStoredContact,
  listStoredContacts,
  saveStoredContact,
} from "./contact-storage";

export async function listContacts(tenantId: string): Promise<LeanYouContact[]> {
  const contacts = await listStoredContacts(tenantId);
  return contacts.sort((a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, "it")
  );
}

export async function getContact(
  tenantId: string,
  contactId: string
): Promise<LeanYouContact | null> {
  return getStoredContact(tenantId, contactId);
}

export async function findContactByEmailForTenant(
  tenantId: string,
  email: string
): Promise<LeanYouContact | null> {
  return findContactByEmail(tenantId, email);
}

export async function saveContact(contact: LeanYouContact): Promise<void> {
  await saveStoredContact(contact);
}

export async function deleteContact(
  tenantId: string,
  contactId: string
): Promise<void> {
  await deleteStoredContact(tenantId, contactId);
}

export function createContact(
  session: LeanYouSession,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phones?: LeanYouContactPhone[];
    organization?: string;
    notes?: string;
  }
): LeanYouContact {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    tenantId: session.tenantId,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    phones: input.phones ?? [],
    organization: input.organization?.trim() ?? "",
    notes: input.notes?.trim() ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

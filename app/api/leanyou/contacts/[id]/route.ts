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
import type { LeanYouContact } from "@/types/leanyou";
import { deleteContact, getContact, saveContact } from "@/lib/leanyou/contacts";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "contatti")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    const contact = await getContact(session.tenantId, id);
    if (!contact) {
      return NextResponse.json({ error: "Contatto non trovato." }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    return handleLeanYouRouteError(error, "Caricamento contatto non riuscito.");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "contatti")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    const contact = await getContact(session.tenantId, id);
    if (!contact) {
      return NextResponse.json({ error: "Contatto non trovato." }, { status: 404 });
    }

    const body = (await request.json()) as Partial<LeanYouContact> & {
      phone?: string;
    };

    const next: LeanYouContact = {
      ...contact,
      firstName:
        body.firstName !== undefined ? body.firstName.trim() : contact.firstName,
      lastName:
        body.lastName !== undefined ? body.lastName.trim() : contact.lastName,
      email: body.email !== undefined ? body.email.trim() : contact.email,
      phones: body.phones ?? contact.phones,
      organization:
        body.organization !== undefined
          ? body.organization.trim()
          : contact.organization,
      notes: body.notes !== undefined ? body.notes.trim() : contact.notes,
      updatedAt: new Date().toISOString(),
    };

    if (body.phone?.trim()) {
      next.phones = [{ label: "Principale", number: body.phone.trim() }];
    }

    await saveContact(next);
    return NextResponse.json({ contact: next });
  } catch (error) {
    return handleLeanYouRouteError(error, "Aggiornamento contatto non riuscito.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSession();
    if (
      !tenantHasModule(session, "events") ||
      !tenantHasLeonardoCapability(session, "contatti")
    ) {
      return forbiddenResponse();
    }

    const { id } = await context.params;
    await deleteContact(session.tenantId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleLeanYouRouteError(error, "Eliminazione contatto non riuscita.");
  }
}

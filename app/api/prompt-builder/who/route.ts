import { NextResponse } from "next/server";

import { clipText, requireProfile, validEmail } from "@/lib/prompt-builder/guard";
import { saveBuilderProfile } from "@/lib/prompt-builder/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const gate = await requireProfile();
  if ("response" in gate) return gate.response;

  const body = (await request.json().catch(() => null)) as { contact?: unknown } | null;
  const contact = clipText(body?.contact, 254);
  if (contact.length < 2) {
    return NextResponse.json(
      { error: "Inserisci il tuo nome o la tua email." },
      { status: 400 }
    );
  }
  if (contact.includes("@") && !validEmail(contact)) {
    return NextResponse.json({ error: "Questa email non è valida." }, { status: 400 });
  }

  const profile = gate.profile;
  if (validEmail(contact)) profile.email = contact.toLowerCase();
  else profile.name = contact;
  await saveBuilderProfile(profile);

  return NextResponse.json({
    ok: true,
    name: profile.name,
    email: profile.email,
  });
}

import { NextResponse } from "next/server";

import {
  createSessionPayload,
  findUserByEmail,
  findUserByToken,
  verifyPassword,
} from "@/lib/leanyou/auth";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/leanyou/session";

function tenantMismatch(
  requestedTenantSlug: string | undefined,
  tenantSlug: string
): boolean {
  return Boolean(
    requestedTenantSlug?.trim() &&
      requestedTenantSlug.trim() !== tenantSlug
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    token?: string;
    tenantSlug?: string;
  };

  if (body.token?.trim()) {
    const match = await findUserByToken(body.token.trim());
    if (!match?.user) {
      return NextResponse.json(
        { error: "Token non valido." },
        { status: 401 }
      );
    }

    if (tenantMismatch(body.tenantSlug, match.tenant.slug)) {
      return NextResponse.json(
        { error: "Token non valido per questo cliente." },
        { status: 401 }
      );
    }

    const session = createSessionPayload(match.tenant, match.user);
    const token = await createSessionToken(session);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, session });
  }

  if (!body.email?.trim() || !body.password) {
    return NextResponse.json(
      { error: "Email e password obbligatorie." },
      { status: 400 }
    );
  }

  const match = await findUserByEmail(body.email);
  if (!match) {
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 }
    );
  }

  if (tenantMismatch(body.tenantSlug, match.tenant.slug)) {
    return NextResponse.json(
      { error: "Credenziali non valide per questo cliente." },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(body.password, match.user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 }
    );
  }

  const session = createSessionPayload(match.tenant, match.user);
  const token = await createSessionToken(session);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, session });
}

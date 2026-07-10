import { NextResponse } from "next/server";

import {
  auditContextFromSession,
  clientIpFromRequest,
  writeLeanYouAuditEvent,
} from "@/lib/leanyou/audit-log";
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

async function logLoginFailure(
  request: Request,
  detail: string,
  partial?: {
    tenantId?: string;
    tenantSlug?: string;
    tenantName?: string;
    userEmail?: string;
    method?: "email" | "token";
  }
) {
  await writeLeanYouAuditEvent({
    action: "login_failed",
    detail,
    ip: clientIpFromRequest(request),
    ...partial,
  });
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
      await logLoginFailure(request, "Token non valido.", {
        method: "token",
      });
      return NextResponse.json(
        { error: "Token non valido." },
        { status: 401 }
      );
    }

    if (tenantMismatch(body.tenantSlug, match.tenant.slug)) {
      await logLoginFailure(request, "Token non valido per questo cliente.", {
        tenantId: match.tenant.id,
        tenantSlug: match.tenant.slug,
        tenantName: match.tenant.name,
        userEmail: match.user.email,
        method: "token",
      });
      return NextResponse.json(
        { error: "Token non valido per questo cliente." },
        { status: 401 }
      );
    }

    const session = createSessionPayload(match.tenant, match.user);
    const token = await createSessionToken(session);
    await setSessionCookie(token);
    await writeLeanYouAuditEvent({
      action: "login_success",
      method: "token",
      ip: clientIpFromRequest(request),
      ...auditContextFromSession(session),
    });
    return NextResponse.json({ ok: true, session });
  }

  if (!body.email?.trim() || !body.password) {
    await logLoginFailure(request, "Email e password obbligatorie.", {
      userEmail: body.email?.trim(),
      method: "email",
    });
    return NextResponse.json(
      { error: "Email e password obbligatorie." },
      { status: 400 }
    );
  }

  const match = await findUserByEmail(body.email);
  if (!match) {
    await logLoginFailure(request, "Credenziali non valide.", {
      userEmail: body.email.trim(),
      method: "email",
    });
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 }
    );
  }

  if (tenantMismatch(body.tenantSlug, match.tenant.slug)) {
    await logLoginFailure(request, "Credenziali non valide per questo cliente.", {
      tenantId: match.tenant.id,
      tenantSlug: match.tenant.slug,
      tenantName: match.tenant.name,
      userEmail: match.user.email,
      method: "email",
    });
    return NextResponse.json(
      { error: "Credenziali non valide per questo cliente." },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(body.password, match.user.passwordHash);
  if (!valid) {
    await logLoginFailure(request, "Password non valida.", {
      tenantId: match.tenant.id,
      tenantSlug: match.tenant.slug,
      tenantName: match.tenant.name,
      userEmail: match.user.email,
      method: "email",
    });
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 }
    );
  }

  const session = createSessionPayload(match.tenant, match.user);
  const token = await createSessionToken(session);
  await setSessionCookie(token);
  await writeLeanYouAuditEvent({
    action: "login_success",
    method: "email",
    ip: clientIpFromRequest(request),
    ...auditContextFromSession(session),
  });
  return NextResponse.json({ ok: true, session });
}

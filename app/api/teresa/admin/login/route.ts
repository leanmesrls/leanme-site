import { NextResponse } from "next/server";

import {
  createLeanHumanSessionToken,
  verifyLeanHumanPassword,
  withLeanHumanCookie,
} from "@/lib/teresa-public/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";

  if (!verifyLeanHumanPassword(password)) {
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 }
    );
  }

  const token = await createLeanHumanSessionToken();
  const response = NextResponse.json({ ok: true });
  return withLeanHumanCookie(response, token);
}

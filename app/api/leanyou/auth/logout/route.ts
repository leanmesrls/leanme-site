import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/leanyou/session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

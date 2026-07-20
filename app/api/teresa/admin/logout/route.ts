import { NextResponse } from "next/server";

import { withoutLeanHumanCookie } from "@/lib/teresa-public/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return withoutLeanHumanCookie(response);
}

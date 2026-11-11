import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isRebuildVisitBot, rebuildVisitTotal } from "@/lib/rebuild-visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "rebuild100_seen";

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const jar = await cookies();
  const seen = jar.get(COOKIE)?.value === "1";
  const countThisVisit = !seen && !isRebuildVisitBot(userAgent);

  let total: number;
  try {
    total = await rebuildVisitTotal(countThisVisit);
  } catch {
    total = await rebuildVisitTotal(false);
    return NextResponse.json({ total }, { headers: { "Cache-Control": "no-store" } });
  }

  if (countThisVisit) {
    jar.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
    });
  }

  return NextResponse.json({ total }, { headers: { "Cache-Control": "no-store" } });
}

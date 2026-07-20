import { NextResponse } from "next/server";

import { getLeanHumanSessionFromCookies } from "@/lib/teresa-public/admin-auth";
import {
  getTeresaPublicThread,
  saveTeresaPublicThread,
} from "@/lib/teresa-public/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const ok = await getLeanHumanSessionFromCookies();
  if (!ok) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await context.params;
  const thread = await getTeresaPublicThread(id);
  if (!thread) {
    return NextResponse.json({ error: "Non trovata." }, { status: 404 });
  }

  if (!thread.readAt) {
    thread.readAt = new Date().toISOString();
    await saveTeresaPublicThread(thread);
  }

  return NextResponse.json({ thread });
}

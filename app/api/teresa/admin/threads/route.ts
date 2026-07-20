import { NextResponse } from "next/server";

import { getLeanHumanSessionFromCookies } from "@/lib/teresa-public/admin-auth";
import { listTeresaPublicThreads } from "@/lib/teresa-public/storage";

export const runtime = "nodejs";

export async function GET() {
  const ok = await getLeanHumanSessionFromCookies();
  if (!ok) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const threads = await listTeresaPublicThreads();
  return NextResponse.json({
    threads: threads.map((thread) => ({
      id: thread.id,
      updatedAt: thread.updatedAt,
      createdAt: thread.createdAt,
      lead: thread.lead,
      messageCount: thread.messages.length,
      notifiedAt: thread.notifiedAt,
      readAt: thread.readAt,
      lastPreview:
        [...thread.messages]
          .reverse()
          .find((message) => message.role === "user")
          ?.content.slice(0, 160) ?? null,
    })),
  });
}

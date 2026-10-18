import { NextResponse } from "next/server";

import { getLeanHumanSessionFromCookies } from "@/lib/teresa-public/admin-auth";
import { listBuilderProfiles } from "@/lib/prompt-builder/storage";

export const runtime = "nodejs";

export async function GET() {
  const ok = await getLeanHumanSessionFromCookies();
  if (!ok) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const profiles = await listBuilderProfiles();
  return NextResponse.json({
    profiles: profiles.map((profile) => {
      const latest = profile.runs[0] ?? null;
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        marketingOptIn: profile.marketingOptIn,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        composeCount: profile.composeCount,
        latestIdea: latest?.idea ?? null,
        latestTool: latest?.toolId ?? null,
        latestFeedback: latest?.feedback ?? null,
      };
    }),
  });
}

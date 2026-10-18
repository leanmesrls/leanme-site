import { NextResponse } from "next/server";

import { builderProfileIdFromCookies } from "@/lib/prompt-builder/session";
import { getBuilderProfile } from "@/lib/prompt-builder/storage";
import { builderExpiresLabel, builderIsOpen } from "@/lib/prompt-builder/window";

export const runtime = "nodejs";

export async function GET() {
  const open = builderIsOpen();
  const id = await builderProfileIdFromCookies();
  const profile = id ? await getBuilderProfile(id) : null;
  return NextResponse.json({
    open,
    expiresLabel: builderExpiresLabel(),
    name: profile?.name ?? null,
  });
}

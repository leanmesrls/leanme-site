import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const PROMPT_BUILDER_COOKIE = "prompt_builder_session";

function secret(): Uint8Array {
  const value =
    process.env.PROMPT_BUILDER_SESSION_SECRET?.trim() ||
    process.env.LEAN_HUMAN_SESSION_SECRET?.trim() ||
    process.env.LEANYOU_SESSION_SECRET?.trim() ||
    "dev-only-prompt-builder-change-me";
  return new TextEncoder().encode(value);
}

export async function signBuilderSession(profileId: string): Promise<string> {
  return new SignJWT({ sid: profileId, kind: "prompt_builder" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function readBuilderSession(
  token: string
): Promise<{ sid: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.kind !== "prompt_builder" || typeof payload.sid !== "string") {
      return null;
    }
    return { sid: payload.sid };
  } catch {
    return null;
  }
}

export async function builderProfileIdFromCookies(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(PROMPT_BUILDER_COOKIE)?.value;
  if (!token) return null;
  const session = await readBuilderSession(token);
  return session?.sid ?? null;
}

export function builderCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

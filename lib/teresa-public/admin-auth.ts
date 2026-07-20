import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const LEAN_HUMAN_COOKIE = "lean_human_session";
const TTL = "12h";

function getSecret(): Uint8Array {
  const secret =
    process.env.LEAN_HUMAN_SESSION_SECRET?.trim() ||
    process.env.LEANYOU_SESSION_SECRET?.trim() ||
    "dev-only-lean-human-change-me";
  return new TextEncoder().encode(secret);
}

export async function createLeanHumanSessionToken(): Promise<string> {
  return new SignJWT({ role: "lean_human_admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(getSecret());
}

export async function readLeanHumanSession(
  token: string
): Promise<{ role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "lean_human_admin") {
      return null;
    }
    return { role: "lean_human_admin" };
  } catch {
    return null;
  }
}

export async function getLeanHumanSessionFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(LEAN_HUMAN_COOKIE)?.value;
  if (!token) {
    return false;
  }
  return Boolean(await readLeanHumanSession(token));
}

export function withLeanHumanCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(LEAN_HUMAN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function withoutLeanHumanCookie(response: NextResponse): NextResponse {
  response.cookies.set(LEAN_HUMAN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function verifyLeanHumanPassword(password: string): boolean {
  const expected = process.env.LEAN_HUMAN_PASSWORD?.trim();
  if (!expected) {
    return false;
  }
  return password === expected;
}

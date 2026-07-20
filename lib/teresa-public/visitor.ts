import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export const TERESA_VISITOR_COOKIE = "teresa_visitor";

export async function getOrSetVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(TERESA_VISITOR_COOKIE)?.value;
  if (existing && existing.length >= 16) {
    return existing;
  }
  const visitorId = randomUUID();
  jar.set(TERESA_VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return visitorId;
}

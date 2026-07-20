import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  LEAN_HUMAN_COOKIE,
  readLeanHumanSession,
} from "@/lib/teresa-public/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/lean-human/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/lean-human")) {
    const token = request.cookies.get(LEAN_HUMAN_COOKIE)?.value;
    const session = token ? await readLeanHumanSession(token) : null;
    if (!session) {
      const login = new URL("/lean-human/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lean-human", "/lean-human/:path*"],
};

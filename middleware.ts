import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_PUBLIC_TENANT_SLUG } from "@/lib/leanyou/constants";
import {
  isLegacyLeanYouPath,
  leanyouLeonardoPath,
  leanyouLoginPath,
  mapLegacyLeanYouPath,
  parseTenantSlugFromPath,
} from "@/lib/leanyou/paths";
import { SESSION_COOKIE, readSessionToken } from "@/lib/leanyou/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/leanyou/auth/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/leanyou")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await readSessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/leanyou")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await readSessionToken(token) : null;

  if (pathname === "/leanyou") {
    if (session) {
      return NextResponse.redirect(
        new URL(leanyouLeonardoPath(session.tenantSlug), request.url)
      );
    }
    return NextResponse.redirect(
      new URL(leanyouLoginPath(DEFAULT_PUBLIC_TENANT_SLUG), request.url)
    );
  }

  if (isLegacyLeanYouPath(pathname)) {
    const target = mapLegacyLeanYouPath(
      pathname,
      session?.tenantSlug ?? DEFAULT_PUBLIC_TENANT_SLUG
    );
    if (target) {
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  const tenantSlug = parseTenantSlugFromPath(pathname);
  if (!tenantSlug) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === leanyouLoginPath(tenantSlug);

  if (isLoginRoute) {
    if (session?.tenantSlug === tenantSlug) {
      return NextResponse.redirect(
        new URL(leanyouLeonardoPath(tenantSlug), request.url)
      );
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(leanyouLoginPath(tenantSlug), request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.tenantSlug !== tenantSlug) {
    return NextResponse.redirect(
      new URL(leanyouLeonardoPath(session.tenantSlug), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/leanyou/:path*", "/api/leanyou/:path*"],
};

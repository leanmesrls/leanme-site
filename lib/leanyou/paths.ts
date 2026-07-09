export function leanyouRoot(): string {
  return "/leanyou";
}

export function leanyouTenantBase(tenantSlug: string): string {
  return `/leanyou/${tenantSlug}`;
}

export function leanyouLoginPath(tenantSlug: string): string {
  return `${leanyouTenantBase(tenantSlug)}/login`;
}

export function leanyouLeonardoPath(tenantSlug: string): string {
  return `${leanyouTenantBase(tenantSlug)}/leonardo`;
}

export function leanyouLeonardoNewPath(tenantSlug: string): string {
  return `${leanyouLeonardoPath(tenantSlug)}/new`;
}

export function leanyouLeonardoWorkspacePath(
  tenantSlug: string,
  workspaceId: string
): string {
  return `${leanyouLeonardoPath(tenantSlug)}/${workspaceId}`;
}

export function parseTenantSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/leanyou\/([^/]+)(?:\/|$)/);
  if (!match?.[1] || match[1] === "login") {
    return null;
  }
  return match[1];
}

export function isLegacyLeanYouPath(pathname: string): boolean {
  return (
    pathname === "/leanyou/login" ||
    pathname.startsWith("/leanyou/leonardo")
  );
}

export function mapLegacyLeanYouPath(
  pathname: string,
  tenantSlug: string
): string | null {
  if (pathname === "/leanyou/login") {
    return leanyouLoginPath(tenantSlug);
  }

  if (pathname.startsWith("/leanyou/leonardo")) {
    return `/leanyou/${tenantSlug}${pathname.slice("/leanyou".length)}`;
  }

  if (pathname === "/leanyou") {
    return leanyouLeonardoPath(tenantSlug);
  }

  return null;
}

export function leanyouRoot(): string {
  return "/leanyou";
}

export function leanyouLoginPath(): string {
  return "/leanyou/login";
}

export function leanyouTenantBase(tenantSlug: string): string {
  return `/leanyou/${tenantSlug}`;
}

export function leanyouTenantLoginPath(tenantSlug: string): string {
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

export function isTenantLoginPath(pathname: string): boolean {
  return /^\/leanyou\/[^/]+\/login$/.test(pathname);
}

export function isLegacyLeanYouLeonardoPath(pathname: string): boolean {
  return pathname.startsWith("/leanyou/leonardo");
}

export function mapLegacyLeanYouLeonardoPath(
  pathname: string,
  tenantSlug: string
): string | null {
  if (pathname.startsWith("/leanyou/leonardo")) {
    return `/leanyou/${tenantSlug}${pathname.slice("/leanyou".length)}`;
  }

  if (pathname === "/leanyou") {
    return leanyouLeonardoPath(tenantSlug);
  }

  return null;
}

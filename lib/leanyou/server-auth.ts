import { getSession } from "@/lib/leanyou/session";
import type { LeanYouSession } from "@/types/leanyou";

export async function requireSession(): Promise<LeanYouSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Non autorizzato." }, { status: 401 });
}

export function forbiddenResponse() {
  return Response.json({ error: "Accesso negato." }, { status: 403 });
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof Error && error.message === "UNAUTHORIZED";
}

export function handleLeanYouRouteError(
  error: unknown,
  fallbackMessage: string
) {
  if (isUnauthorizedError(error)) {
    return unauthorizedResponse();
  }

  console.error(
    JSON.stringify({
      leanyou_route_error: {
        message: error instanceof Error ? error.message : String(error),
      },
    })
  );

  return Response.json({ error: fallbackMessage }, { status: 500 });
}

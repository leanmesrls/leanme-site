import { notFound, redirect } from "next/navigation";

import { LeanYouShell } from "@/components/leanyou/LeanYouShell";
import { LeonardoWorkspaceDetail } from "@/components/leanyou/LeonardoWorkspaceDetail";
import { findTenantBySlug, tenantHasModule } from "@/lib/leanyou/auth";
import { createPageMetadata } from "@/lib/metadata";
import {
  leanyouLeonardoPath,
  leanyouLeonardoWorkspacePath,
  leanyouLoginPath,
} from "@/lib/leanyou/paths";
import { getSession } from "@/lib/leanyou/session";
import { getWorkspace } from "@/lib/leanyou/workspaces";

interface PageProps {
  params: Promise<{ tenantSlug: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tenantSlug, id } = await params;

  return createPageMetadata({
    title: `LeanYou · Workspace ${id.slice(0, 8)}`,
    description: "Dettaglio workspace Leonardo.",
    path: leanyouLeonardoWorkspacePath(tenantSlug, id),
    noIndex: true,
  });
}

export default async function LeonardoWorkspacePage({ params }: PageProps) {
  const { tenantSlug, id } = await params;
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    notFound();
  }

  const session = await getSession();
  if (!session) {
    redirect(leanyouLoginPath(tenantSlug));
  }
  if (!tenantHasModule(session, "leonardo")) {
    redirect(leanyouLeonardoPath(tenantSlug));
  }

  const workspace = await getWorkspace(session.tenantId, id);
  if (!workspace) {
    notFound();
  }

  return (
    <LeanYouShell session={session}>
      <LeonardoWorkspaceDetail
        tenantSlug={tenantSlug}
        initialWorkspace={workspace}
      />
    </LeanYouShell>
  );
}

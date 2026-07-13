import { notFound, redirect } from "next/navigation";

import { LeanYouShell } from "@/components/leanyou/LeanYouShell";
import { LeonardoContactList } from "@/components/leanyou/LeonardoContactList";
import {
  findTenantBySlug,
  tenantHasLeonardoCapability,
  tenantHasModule,
} from "@/lib/leanyou/auth";
import { listContacts } from "@/lib/leanyou/contacts";
import { createPageMetadata } from "@/lib/metadata";
import {
  leanyouLeonardoContattiPath,
  leanyouLeonardoPath,
  leanyouLoginPath,
} from "@/lib/leanyou/paths";
import { getSession } from "@/lib/leanyou/session";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tenantSlug } = await params;

  return createPageMetadata({
    title: "LeanYou · Rubrica contatti",
    description: "Rubrica contatti Leonardo.",
    path: leanyouLeonardoContattiPath(tenantSlug),
    noIndex: true,
  });
}

export default async function LeonardoContattiPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    notFound();
  }

  const session = await getSession();
  if (!session) {
    redirect(leanyouLoginPath());
  }
  if (
    !tenantHasModule(session, "events") ||
    !tenantHasLeonardoCapability(session, "contatti")
  ) {
    redirect(leanyouLeonardoPath(tenantSlug));
  }

  const contacts = await listContacts(session.tenantId);

  return (
    <LeanYouShell session={session}>
      <LeonardoContactList initialContacts={contacts} />
    </LeanYouShell>
  );
}

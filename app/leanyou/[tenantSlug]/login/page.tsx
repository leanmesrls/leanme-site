import { notFound } from "next/navigation";

import { LeanYouLoginPageContent } from "@/components/leanyou/LeanYouLoginPageContent";
import { findTenantBySlug } from "@/lib/leanyou/auth";
import { createPageMetadata } from "@/lib/metadata";
import { leanyouLoginPath } from "@/lib/leanyou/paths";

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tenantSlug } = await params;
  const tenant = await findTenantBySlug(tenantSlug);

  return createPageMetadata({
    title: tenant
      ? `LeanYou · ${tenant.name}`
      : "LeanYou · Accesso riservato",
    description: "Area riservata clienti LeanMe.",
    path: leanyouLoginPath(tenantSlug),
    noIndex: true,
  });
}

export default async function LeanYouTenantLoginPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const tenant = await findTenantBySlug(tenantSlug);
  if (!tenant) {
    notFound();
  }

  return (
    <LeanYouLoginPageContent tenantSlug={tenantSlug} tenantName={tenant.name} />
  );
}

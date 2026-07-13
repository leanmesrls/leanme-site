import type {
  LeanYouLeonardoCapabilities,
  LeanYouModule,
  LeanYouSession,
  LeanYouTenant,
} from "@/types/leanyou";

export type LeonardoCapabilityKey = keyof LeanYouLeonardoCapabilities;

export const LEONARDO_UPGRADE_EMAIL = "info@leanme.it";

export const LEONARDO_UPGRADE_HINT =
  "contatta LeanMe per l'upload dei tuoi servizi";

export function deriveLeonardoCapabilities(
  modules: LeanYouModule[]
): LeanYouLeonardoCapabilities {
  const hasLeonardo = modules.includes("leonardo");
  const hasEvents = modules.includes("events");

  return {
    hub: hasLeonardo || hasEvents,
    verbali: hasLeonardo,
    eventi: hasEvents,
    contatti: hasEvents,
    finance: false,
    lean_human: hasLeonardo || hasEvents,
    government: false,
    hotel: hasEvents,
    logistica: hasEvents,
    budget: false,
    comunicazioni: false,
    ospiti: hasEvents,
    docenti: hasEvents,
    delegazioni: hasEvents,
    registrazione: hasEvents,
    abstract: false,
    survey: false,
    connect: false,
    ecm: false,
    stampati: false,
    archivio_mail: false,
    public_site: false,
    participant_portal: false,
    payments_paypal: false,
    ai_writing: false,
    ai_graphics: false,
    ai_assistant: false,
  };
}

export function resolveLeonardoCapabilities(
  tenant: LeanYouTenant
): LeanYouLeonardoCapabilities {
  const derived = deriveLeonardoCapabilities(tenant.modules);
  if (tenant.leonardoCapabilities) {
    return { ...derived, ...tenant.leonardoCapabilities };
  }
  return derived;
}

export function getSessionLeonardoCapabilities(
  session: LeanYouSession
): LeanYouLeonardoCapabilities {
  if (session.leonardoCapabilities) {
    return session.leonardoCapabilities;
  }
  return deriveLeonardoCapabilities(session.modules);
}

export function tenantHasLeonardoCapability(
  session: LeanYouSession,
  capability: LeonardoCapabilityKey
): boolean {
  return getSessionLeonardoCapabilities(session)[capability];
}

export function leonardoUpgradeMailto(subject: string): string {
  return `mailto:${LEONARDO_UPGRADE_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

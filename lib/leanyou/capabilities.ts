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

function emptyLeonardoCapabilities(): LeanYouLeonardoCapabilities {
  return {
    hub: false,
    verbali: false,
    eventi: false,
    contatti: false,
    finance: false,
    lean_human: false,
    government: false,
    hotel: false,
    logistica: false,
    budget: false,
    comunicazioni: false,
    ospiti: false,
    docenti: false,
    delegazioni: false,
    registrazione: false,
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

/** Pilot: tenant LeanYou con almeno un modulo base → piattaforma completa aperta. */
function fullLeonardoCapabilities(): LeanYouLeonardoCapabilities {
  return {
    hub: true,
    verbali: true,
    eventi: true,
    contatti: true,
    finance: true,
    lean_human: true,
    government: true,
    hotel: true,
    logistica: true,
    budget: true,
    comunicazioni: true,
    ospiti: true,
    docenti: true,
    delegazioni: true,
    registrazione: true,
    abstract: true,
    survey: true,
    connect: true,
    ecm: true,
    stampati: true,
    archivio_mail: true,
    public_site: true,
    participant_portal: true,
    payments_paypal: true,
    ai_writing: true,
    ai_graphics: true,
    ai_assistant: true,
  };
}

function tenantHasLeanYouAccess(modules: LeanYouModule[]): boolean {
  return (
    modules.includes("leonardo") ||
    modules.includes("events") ||
    modules.includes("government")
  );
}

export function deriveLeonardoCapabilities(
  modules: LeanYouModule[]
): LeanYouLeonardoCapabilities {
  if (!tenantHasLeanYouAccess(modules)) {
    return emptyLeonardoCapabilities();
  }

  return fullLeonardoCapabilities();
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

export type LeanYouUserRole = "admin" | "member";

export type LeanYouModule = "leonardo" | "events" | "government";

export interface LeanYouLeonardoCapabilities {
  /** Sidebar — cruscotto */
  hub: boolean;
  /** Sidebar — verbali AI */
  verbali: boolean;
  /** Sidebar — lista eventi */
  eventi: boolean;
  /** Sidebar — rubrica globale */
  contatti: boolean;
  /** Sidebar — report budget aggregato agenzia */
  finance: boolean;
  /** Sidebar — Lean.Human (supporto umano LMI) */
  lean_human: boolean;
  /** Sidebar — Government (società scientifiche), servizio separato */
  government: boolean;
  /** Tab evento — hotel (allotment, camere) */
  hotel: boolean;
  /** Tab evento — viaggi, transfer, hospitality */
  logistica: boolean;
  /** Tab evento — preventivo/consuntivo singolo evento */
  budget: boolean;
  /** Tab evento — email, newsletter, SMS, … */
  comunicazioni: boolean;
  /** Tab evento — ospiti da rubrica per categoria ruolo */
  ospiti: boolean;
  /** Tab evento — docenti, lettere incarico */
  docenti: boolean;
  /** Tab evento */
  delegazioni: boolean;
  registrazione: boolean;
  abstract: boolean;
  survey: boolean;
  connect: boolean;
  ecm: boolean;
  stampati: boolean;
  archivio_mail: boolean;
  public_site: boolean;
  participant_portal: boolean;
  payments_paypal: boolean;
  ai_writing: boolean;
  ai_graphics: boolean;
  ai_assistant: boolean;
}

export interface LeanYouUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: LeanYouUserRole;
  passwordHash: string;
  accessToken: string;
}

export interface LeanYouTenant {
  id: string;
  name: string;
  slug: string;
  accessToken: string;
  modules: LeanYouModule[];
  leonardoCapabilities?: Partial<LeanYouLeonardoCapabilities>;
  users: LeanYouUser[];
}

export interface LeanYouTenantsFile {
  tenants: LeanYouTenant[];
}

export interface LeanYouSession {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: LeanYouUserRole;
  modules: LeanYouModule[];
  leonardoCapabilities?: LeanYouLeonardoCapabilities;
}

export type LeonardoWorkspaceStatus =
  | "draft"
  | "content_ready"
  | "processing"
  | "completed"
  | "failed";

export type LeonardoMeetingType =
  | "client_meeting"
  | "scientific_committee"
  | "internal_meeting";

export interface LeonardoWorkspace {
  id: string;
  tenantId: string;
  createdBy: string;
  title: string;
  client: string;
  organization: string;
  meetingDate: string;
  meetingType: LeonardoMeetingType;
  tags: string[];
  participants: string;
  moderator: string;
  secretary: string;
  notes: string;
  linkedEventId: string | null;
  status: LeonardoWorkspaceStatus;
  transcript: string;
  structured: Record<string, unknown> | null;
  documents: Record<string, string>;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeonardoEventType = "base" | "ecm";

export type LeonardoEventCategoryId =
  | "formazione_sanitaria"
  | "formazione_non_sanitaria"
  | "artistico"
  | "evento_aziendale"
  | "evento_incentive"
  | "inaugurazione"
  | "vernissage"
  | "fiera";

export type LeonardoEcmModality =
  | "res"
  | "fad"
  | "fsc"
  | "blended_res_fsc"
  | "res_fad";

export type LeonardoEventStatus = "draft" | "active" | "completed" | "archived";

export interface LeonardoEvent {
  id: string;
  tenantId: string;
  createdBy: string;
  cdc: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  /** Tipologia evento (anagrafica) */
  categoryId: LeonardoEventCategoryId;
  /** Solo per formazione sanitaria */
  healthAreaId: string | null;
  /** Solo per formazione sanitaria — null finché non risposto */
  ecmEnabled: boolean | null;
  /** Obbligatorio se ecmEnabled === true */
  ecmModality: LeonardoEcmModality | null;
  /** @deprecated Usare categoryId + campi ECM */
  type?: LeonardoEventType;
  status: LeonardoEventStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeanYouContactPhone {
  label: string;
  number: string;
}

export interface LeanYouContact {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Per area riservata partecipante (accesso multi-evento) */
  fiscalCode?: string;
  phones: LeanYouContactPhone[];
  organization: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Ruolo di un contatto rubrica su un singolo evento (multi-ruolo / multi-evento). */
export type LeonardoEventRoleCategory =
  | "ospite"
  | "docente"
  | "relatore"
  | "segreteria_scientifica"
  | "pt"
  | "delegazione"
  | "sponsor"
  | "patrocinio"
  | "staff";

export interface LeonardoEventContactAssignment {
  id: string;
  tenantId: string;
  eventId: string;
  contactId: string;
  roleCategory: LeonardoEventRoleCategory;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeanYouNavItem {
  id: string;
  label: string;
  href?: string;
  segment?: string;
  module?: LeanYouModule;
  capability?: keyof LeanYouLeonardoCapabilities;
  icon:
    | "dashboard"
    | "leonardo"
    | "events"
    | "contacts"
    | "finance"
    | "support"
    | "government"
    | "settings"
    | "locked";
}

export interface LeanYouPromptTemplate {
  slug: LeonardoMeetingType;
  name: string;
  systemPrompt: string;
}

export interface LeanYouConfig {
  productName: string;
  version?: string;
  leonardo: {
    title: string;
    subtitle: string;
    logo: string;
    meetingTypes: Array<{ value: LeonardoMeetingType; label: string }>;
    documentTypes: Array<{ id: string; label: string }>;
  };
  navigation: LeanYouNavItem[];
}

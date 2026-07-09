export type LeanYouUserRole = "admin" | "member";

export type LeanYouModule = "leonardo" | "events";

export interface LeanYouUser {
  id: string;
  email: string;
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
  status: LeonardoWorkspaceStatus;
  transcript: string;
  structured: Record<string, unknown> | null;
  documents: Record<string, string>;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeanYouNavItem {
  id: string;
  label: string;
  href?: string;
  segment?: string;
  module?: LeanYouModule;
  icon: "dashboard" | "leonardo" | "settings";
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

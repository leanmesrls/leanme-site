export interface TeresaPublicLead {
  firstName: string;
  lastName: string;
  email: string;
  acceptedAiTermsAt: string;
}

export interface TeresaPublicMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface TeresaPublicThread {
  id: string;
  visitorId: string;
  source: "public_site";
  lead: TeresaPublicLead | null;
  messages: TeresaPublicMessage[];
  createdAt: string;
  updatedAt: string;
  /** Email di notifica già inviata (solo chat pubblica). */
  notifiedAt: string | null;
  readAt: string | null;
}

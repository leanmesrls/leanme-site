export interface SegreteriaPersonContacts {
  phone?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
}

export interface SegreteriaTeamMemberRef {
  personSlug: string;
  ctaLabel?: string;
}

export interface SegreteriaData {
  meta: {
    title: string;
    description: string;
    path: string;
  };
  welcome: {
    eyebrow: string;
    title: string;
    leonardoName: string;
    leonardoRole: string;
    introParagraphs: string[];
  };
  leonardo: {
    agentSlug: string;
    personAssistCopy: string;
    vcardFeedback: string;
    image: {
      src: string;
      alt: string;
    };
    guide: {
      title: string;
      step1Question: string;
      step2Question: string;
      step3Question: string;
      confirmLabel: string;
      restartLabel: string;
      backLabel: string;
      companyLabel: string;
      staffLabel: string;
      staffActionId: string;
      confirmPrefix: string;
      doneMessage: string;
    };
  };
  team: {
    id: string;
    title: string;
    subtitle: string;
    members: SegreteriaTeamMemberRef[];
  };
  company: {
    id: string;
    title: string;
    subtitle: string;
    openingHours: string[];
  };
  agents: {
    id: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
    image: {
      src: string;
      alt: string;
    };
  };
  links: {
    home: string;
    contatti: string;
    prenotaConsulenza: string;
    staffIbrido: string;
    segreteria: string;
  };
  labels: {
    saveToContacts: string;
    downloadDigitalCard: string;
    call: string;
    callOffice: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    maps: string;
    visitSite: string;
    bookConsultation: string;
    contactForm: string;
    contactOffice: string;
    contactSegreteria: string;
    backToSegreteria: string;
    openProfile: string;
  };
  peopleContacts: Record<string, SegreteriaPersonContacts>;
  companyVcard: {
    slug: string;
    displayName: string;
    organization: string;
  };
}

export type SegreteriaActionId =
  | "save"
  | "download"
  | "call"
  | "email"
  | "whatsapp"
  | "linkedin"
  | "maps"
  | "visitSite"
  | "bookConsultation"
  | "contactForm"
  | "contactOffice"
  | "contactSegreteria"
  | "backToSegreteria"
  | "discover";

export interface SegreteriaAction {
  id: SegreteriaActionId;
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  download?: boolean;
}

export interface SegreteriaResolvedPerson {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  shortBio: string;
  image: string;
  imageAlt: string;
  contacts: SegreteriaPersonContacts;
  profilePath: string;
  segreteriaPath: string;
  vcardPath: string;
}

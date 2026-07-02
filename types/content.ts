export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  platform: string;
}

export interface SiteConfig {
  name: string;
  company: string;
  claim: string;
  claimSecondary: string;
  url: string;
  locale: string;
  language: string;
  navigation: NavItem[];
  footer: {
    tagline: string;
    copyright: string;
    social: SocialLink[];
    legalLinks: NavItem[];
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
  };
}

export interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

export interface ImageAsset {
  src: string;
  alt: string;
  replaceHint: string;
  width?: number;
  height?: number;
}

export interface SectionBase {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
}

export interface Percorso {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: ImageAsset;
  services: string[];
}

export interface LeanAgent {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  action?: string;
  actionColor?: string;
  description: string;
  image: ImageAsset;
  cardImage: ImageAsset;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  description: string;
  image: ImageAsset;
}

export interface Specialist {
  name: string;
  area: string;
  description: string;
}

export interface StaffData {
  intro: SectionBase;
  people: TeamMember[];
  leanAgents: LeanAgent[];
  network: {
    title: string;
    description: string;
    specialists: Specialist[];
  };
}

export interface LeanLabCategory {
  slug: string;
  title: string;
  description: string;
}

export interface LeanLabArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: ImageAsset;
  author: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: ImageAsset;
}

export interface AcademyResource {
  slug: string;
  title: string;
  type: string;
  description: string;
  image: ImageAsset;
  href: string;
}

export interface AcademyData {
  intro: SectionBase;
  publicArea: {
    title: string;
    description: string;
    resources: AcademyResource[];
  };
  reservedArea: {
    title: string;
    description: string;
    features: string[];
  };
}

export interface ContactData {
  intro: SectionBase;
  legalAddress: {
    label: string;
    lines: string[];
  };
  operationalAddress: {
    label: string;
    lines: string[];
  };
  phone: {
    label: string;
    value: string;
    href: string;
  };
  email: {
    label: string;
    value: string;
    href: string;
  };
  social: SocialLink[];
  map: {
    embedUrl: string;
    label: string;
  };
  foundation: {
    title: string;
    description: string;
  };
  form: {
    title: string;
    description: string;
    submitLabel: string;
  };
}

export interface ChiSiamoSection {
  id: string;
  title: string;
  content: string[];
}

export interface ChiSiamoData {
  intro: SectionBase;
  sections: ChiSiamoSection[];
}

export interface HomepageSection {
  id: string;
  enabled: boolean;
}

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    claim: string;
    description: string;
    image: ImageAsset;
    primaryCta: CTA;
    secondaryCta: CTA;
  };
  humanAi: SectionBase & {
    content: string[];
    image: ImageAsset;
    cta: CTA;
  };
  percorsiTrasformazione: SectionBase & {
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  soluzioniSuMisura: SectionBase & {
    items: Array<{
      title: string;
      description: string;
      image: ImageAsset;
    }>;
  };
  metodoLeanMe: SectionBase & {
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  leanAgentTeam: SectionBase & {
    description: string;
  };
  leanLab: SectionBase & {
    description: string;
    cta: CTA;
  };
  caseStudies: SectionBase & {
    items: Array<{
      title: string;
      client: string;
      description: string;
      image: ImageAsset;
      href: string;
    }>;
    cta: CTA;
  };
  cta: SectionBase & {
    primaryCta: CTA;
    secondaryCta: CTA;
  };
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  description: string;
  image: ImageAsset;
  results: string[];
}

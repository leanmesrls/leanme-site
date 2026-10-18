export const PART_KINDS = [
  "ruolo",
  "obiettivo",
  "contesto",
  "formato",
  "verifica",
] as const;

export type PartKind = (typeof PART_KINDS)[number];

export interface LabQuestion {
  id: string;
  axis: string;
  prompt: string;
  options: string[];
  angela: string;
}

export interface LabAnswer {
  id: string;
  value: string;
}

export interface LabPart {
  kind: PartKind;
  text: string;
}

export interface LabRun {
  id: string;
  idea: string;
  category: string;
  questions: LabQuestion[];
  answers: LabAnswer[];
  prompt: string;
  parts: LabPart[];
  why: Array<{ kind: PartKind; meaning: string }>;
  toolId: string;
  toolBecause: string;
  alternatives: string[];
  createdAt: string;
  copiedAt: string | null;
  feedback: "utile" | "da_rifare" | null;
  feedbackNote: string;
}

export interface BuilderProfile {
  id: string;
  name: string;
  email: string;
  privacyAcceptedAt: string;
  marketingOptIn: boolean;
  marketingOptInAt: string | null;
  createdAt: string;
  updatedAt: string;
  questionCalls: number;
  composeCount: number;
  windowStart: string;
  draft: {
    idea: string;
    category: string;
    angela: string;
    questions: LabQuestion[];
  } | null;
  runs: LabRun[];
}

export interface QuestionPlan {
  category: string;
  ready: boolean;
  angela: string;
  questions: LabQuestion[];
}

export interface FreeTool {
  id: string;
  name: string;
  href: string;
  fits: string;
}

/** Catalogo aggiornabile da LeanMe. Il modello può scegliere solo questi id. */
export const FREE_TOOLS: FreeTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    href: "https://chatgpt.com",
    fits: "Testi, idee e istruzioni da raffinare in una conversazione.",
  },
  {
    id: "gemini",
    name: "Gemini",
    href: "https://gemini.google.com",
    fits: "Ricerche, documenti lunghi e immagini nel piano gratuito.",
  },
  {
    id: "claude",
    name: "Claude",
    href: "https://claude.ai",
    fits: "Testi lunghi, analisi di documenti e riscritture accurate.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    href: "https://www.perplexity.ai",
    fits: "Ricerche con fonti da controllare.",
  },
];

export function toolById(id: string): FreeTool | undefined {
  return FREE_TOOLS.find((tool) => tool.id === id);
}

export function catalogForModel(): string {
  return FREE_TOOLS.map(
    (tool) => `- ${tool.id}: ${tool.name}. ${tool.fits}`
  ).join("\n");
}

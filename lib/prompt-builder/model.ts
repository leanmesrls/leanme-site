import { catalogForModel, toolById } from "@/lib/prompt-builder/catalog";
import { PART_KINDS, type LabPart, type LabQuestion, type PartKind, type QuestionPlan } from "@/lib/prompt-builder/types";

const QUESTION_SYSTEM = `Sei il progettista del Lean Prompt Builder di LeanMe.
È un laboratorio che insegna a scrivere un prompt, non una chat e non un assistente che svolge il compito.

Prepara fino a 3 domande, e per una richiesta generica falle tutte e 3: obiettivo, destinatario o contesto, forma del risultato. Scendi a 1 o 2 solo se quegli elementi sono già scritti in modo esplicito.
Se la richiesta riguarda un'immagine, chiedi soggetto, stile e dove verrà usata.
Se riguarda dati, chiedi quale informazione serve, quali dati ci sono e come mostrarli.
Se obiettivo, contesto e formato sono già nel testo, non fare domande.

Ogni domanda ha da 3 a 5 opzioni brevi e concrete, diverse tra loro.
Il campo angela è un consiglio di massimo 18 parole: spiega perché quella domanda rende l'istruzione migliore. Niente emoji.

Rispondi solo con JSON:
{"category":"testo|immagine|dati|idea|studio|altro","ready":false,"angela":"","questions":[{"id":"q1","axis":"obiettivo","prompt":"...","options":["..."],"angela":"..."}]}
Se non servono domande, questions è [] e ready è true. angela spiega in una frase perché si può già scrivere il prompt.`;

const COMPOSE_SYSTEM = `Sei il progettista del Lean Prompt Builder di LeanMe.
Scrivi un prompt in italiano che la persona possa copiare in uno strumento AI gratuito.
Non svolgere il compito. Non inventare fatti che la persona non ha detto: se manca un dato, chiedi nel testo di domandarlo prima di procedere.

Il prompt è un testo discorsivo, di due o quattro frasi collegate, come lo diresti a una persona. Fonde l'idea e le risposte in un'unica istruzione naturale.
Non è uno schema. Non usare etichette (Ruolo, Obiettivo, Contesto, Formato, Verifica), elenchi puntati, due punti da titolo, né la forma domanda e risposta. Non ripetere le domande una per una.

Dentro quel testo continuo devono comunque esserci, come frasi normali, il ruolo, l'obiettivo, il contesto, il formato del risultato e una verifica. parts.text è una sottostringa esatta del campo prompt, non un titolo.
why: una frase breve per ciascun kind, dice a cosa serve quel pezzo.
Scegli tool.id dal catalogo in base a questo caso, non per abitudine e non copiando sempre la stessa coppia.
- claude: prototipo, progetto, specifica, interfaccia, prodotto, flusso, analisi o testo lungo.
- gemini: immagine, illustrazione, contenuto visivo, documento da guardare.
- perplexity: ricerca in cui servono fonti da controllare.
- chatgpt: bozza breve, idea o testo da sistemare in una conversazione.
Un prototipo funzionale o un lavoro da progettista va su claude, non su chatgpt.
because è una frase sul caso specifico, senza dire che quello strumento è il migliore in assoluto.
alternatives: uno o due id diversi, adatti come seconda scelta, non sempre gli stessi.

Catalogo:
${catalogForModel()}

Rispondi solo con JSON:
{"prompt":"...","parts":[{"kind":"ruolo|obiettivo|contesto|formato|verifica","text":"..."}],"why":[{"kind":"ruolo","meaning":"..."}],"tool":{"id":"<id del catalogo adatto a questo caso>","because":"..."},"alternatives":["<altro id>"]}`;

function modelName(): string {
  return (
    process.env.OPENAI_PROMPT_BUILDER_MODEL?.trim() ||
    process.env.OPENAI_TERESA_MODEL?.trim() ||
    process.env.OPENAI_STRUCTURING_MODEL?.trim() ||
    "gpt-4.1-mini"
  );
}

function clip(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function parseJson(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

async function complete(system: string, user: string): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName(),
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PROMPT_BUILDER_MODEL_FAILED:${errorText.slice(0, 280)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("PROMPT_BUILDER_EMPTY");
  return parseJson(content);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export async function planQuestions(idea: string): Promise<QuestionPlan> {
  const raw = await complete(
    QUESTION_SYSTEM,
    `Richiesta della persona:\n${idea}`
  );
  const record = asRecord(raw);
  const questions: LabQuestion[] = [];
  const list = Array.isArray(record?.questions) ? record.questions : [];
  for (const item of list.slice(0, 3)) {
    const row = asRecord(item);
    if (!row || typeof row.prompt !== "string") continue;
    const options = Array.isArray(row.options)
      ? row.options
          .filter((option): option is string => typeof option === "string")
          .map((option) => clip(option, 80))
          .filter(Boolean)
          .slice(0, 5)
      : [];
    if (options.length < 2) continue;
    questions.push({
      id: clip(typeof row.id === "string" ? row.id : `q${questions.length + 1}`, 24),
      axis: clip(typeof row.axis === "string" ? row.axis : "contesto", 32),
      prompt: clip(row.prompt, 180),
      options,
      angela: clip(typeof row.angela === "string" ? row.angela : "", 140),
    });
  }

  return {
    category: clip(typeof record?.category === "string" ? record.category : "altro", 24),
    ready: questions.length === 0,
    angela: clip(typeof record?.angela === "string" ? record.angela : "", 180),
    questions,
  };
}

export interface ComposedPrompt {
  prompt: string;
  parts: LabPart[];
  why: Array<{ kind: PartKind; meaning: string }>;
  toolId: string;
  toolBecause: string;
  alternatives: string[];
}

function preferredTool(text: string, category: string): string | null {
  const blob = `${text} ${category}`.toLowerCase();
  const image = /immagin|foto|illustr|visual|locandina|disegno/.test(blob);
  const prototype =
    /prototip|progett|specifica|interfaccia|funzionale|designer|ux\b|ui\b|architett|prodotto|flusso|schermat/.test(
      blob
    );
  if (prototype && !image) return "claude";
  if (/font[ie]|citaz|notizi|aggiornat|ricerca sul web|fonti da/.test(blob)) return "perplexity";
  if (image || category === "immagine") return "gemini";
  if (category === "studio") return "perplexity";
  if (category === "dati" || prototype) return "claude";
  return null;
}

function becauseFor(id: string): string {
  if (id === "claude") {
    return "Qui serve un ragionamento lungo, una struttura o una specifica. Claude regge meglio questo tipo di lavoro.";
  }
  if (id === "gemini") {
    return "Il caso ha una parte visiva o un documento da guardare. Gemini è più adatto di una chat solo testuale.";
  }
  if (id === "perplexity") {
    return "Servono fonti da controllare. Perplexity le mostra, e restano da verificare.";
  }
  return "È una bozza o un testo da raffinare in conversazione. ChatGPT basta per partire.";
}

function asKind(value: unknown): PartKind | null {
  return typeof value === "string" && PART_KINDS.includes(value as PartKind)
    ? (value as PartKind)
    : null;
}

export async function composePrompt(input: {
  idea: string;
  category: string;
  answers: Array<{ question: string; value: string }>;
}): Promise<ComposedPrompt> {
  const raw = await complete(
    COMPOSE_SYSTEM,
    [
      `Idea iniziale:\n${input.idea}`,
      `Categoria: ${input.category}`,
      input.answers.length
        ? `Dettagli emersi, da fondere nel testo e non da ripetere come elenco:\n${input.answers
            .map((answer) => `${answer.question} → ${answer.value}`)
            .join("\n")}`
        : "Nessuna domanda aggiuntiva: l'idea era già abbastanza chiara.",
    ].join("\n\n")
  );
  const record = asRecord(raw);
  const prompt = typeof record?.prompt === "string" ? record.prompt.trim() : "";
  if (prompt.length < 40) {
    throw new Error("PROMPT_BUILDER_SHORT");
  }

  const parts: LabPart[] = [];
  const partRows = Array.isArray(record?.parts) ? record.parts : [];
  for (const item of partRows) {
    const row = asRecord(item);
    const kind = asKind(row?.kind);
    const text = typeof row?.text === "string" ? row.text.trim() : "";
    if (!kind || !text || !prompt.includes(text)) continue;
    parts.push({ kind, text });
  }

  const why: ComposedPrompt["why"] = [];
  const whyRows = Array.isArray(record?.why) ? record.why : [];
  for (const item of whyRows) {
    const row = asRecord(item);
    const kind = asKind(row?.kind);
    const meaning = typeof row?.meaning === "string" ? clip(row.meaning, 160) : "";
    if (!kind || !meaning) continue;
    why.push({ kind, meaning });
  }

  const tool = asRecord(record?.tool);
  const requested = typeof tool?.id === "string" ? tool.id : "";
  const modelId = toolById(requested)?.id ?? "";
  const signal = preferredTool(
    `${input.idea} ${input.answers.map((answer) => `${answer.question} ${answer.value}`).join(" ")}`,
    input.category
  );
  const toolId = signal ?? (modelId || "chatgpt");
  const alternatives = [
    ...(modelId && modelId !== toolId ? [modelId] : []),
    ...(Array.isArray(record?.alternatives) ? record.alternatives : []),
  ]
    .filter((id): id is string => typeof id === "string" && Boolean(toolById(id)))
    .filter((id) => id !== toolId)
    .filter((id, index, list) => list.indexOf(id) === index)
    .slice(0, 2);
  const modelBecause =
    typeof tool?.because === "string" ? tool.because : "Adatto a questo tipo di richiesta.";

  return {
    prompt: prompt.slice(0, 4000),
    parts,
    why,
    toolId,
    toolBecause: clip(signal && signal !== modelId ? becauseFor(signal) : modelBecause, 220),
    alternatives,
  };
}

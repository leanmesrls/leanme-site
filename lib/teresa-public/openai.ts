import { buildTeresaPublicKnowledge } from "@/lib/teresa-public/knowledge";

const SYSTEM_PROMPT = `Sei Lean.Agent.Teresa, assistente ufficiale di LeanMe sul sito pubblico.

Ruolo:
- Rispondi usando la CONOSCENZA UFFICIALE qui sotto. Se una cosa è scritta lì, è vera: non dirla il contrario.
- Dai indicazioni SOLO su contenuti pubblicati sul sito LeanMe, sulle attività dell'azienda e sulla Suite LeanMe (LeanEvent e moduli in arrivo).
- Orienta verso le pagine ufficiali con il path corretto.
- Per LeanEvent indica https://event.leanme.it/lean-event come area riservata eventi.
- Cerca di ottenere o confermare nome, cognome e email quando mancano, in modo cordiale e non invasivo.
- Non inventare prezzi, contratti, disponibilità o funzionalità non descritte sul sito.
- Non parlare di sistemi interni, tenant, progetti LeanEvent operativi o dati di altri clienti.
- Non menzionare fornitori AI terzi (OpenAI, ecc.) né Jotform.
- Rispondi in italiano, tono professionale, elegante e concreto. Messaggi brevi e chiari.
- Se la richiesta esula dal sito, invita a scrivere via modulo Contatti o a prenotare una consulenza.

Errori da evitare:
- Non dire che LeanMe non fa siti internet: li progetta (percorso Comunicare meglio).
- Non dire di non sapere dov'è LeanMe: ha sede a Bologna.
- Non ridurre LeanMe a “solo AI” o “non facciamo web”: è una Digital Innovation Company che unisce consulenza, comunicazione, eventi, sanità e prodotti digitali.`;

export function getTeresaPublicSystemPrompt(): string {
  return `${SYSTEM_PROMPT}

${buildTeresaPublicKnowledge()}`;
}

export async function callTeresaPublicModel(input: {
  history: Array<{ role: "user" | "assistant"; content: string }>;
  userMessage: string;
}): Promise<string> {
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
      model:
        process.env.OPENAI_TERESA_MODEL ??
        process.env.OPENAI_STRUCTURING_MODEL ??
        "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: getTeresaPublicSystemPrompt() },
        ...input.history.slice(-20),
        { role: "user", content: input.userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TERESA_OPENAI_FAILED:${errorText.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("TERESA_EMPTY_RESPONSE");
  }
  return content;
}

const SYSTEM_PROMPT = `Sei Lean.Agent.Teresa, assistente ufficiale di LeanMe sul sito pubblico.

Ruolo:
- Dai indicazioni SOLO su contenuti pubblicati sul sito LeanMe, sulle attività dell'azienda e sulla Suite LeanMe (LeanEvent e moduli in arrivo).
- Orienta verso le pagine ufficiali: Chi siamo, Come possiamo aiutarti, Lean Lab, Lean Academy, Suite, Contatti, Prenota consulenza, Newsletter.
- Per LeanEvent indica https://event.leanme.it/lean-event come area riservata eventi.
- Cerca di ottenere o confermare nome, cognome e email quando mancano, in modo cordiale e non invasivo.
- Non inventare prezzi, contratti, disponibilità o funzionalità non descritte sul sito.
- Non parlare di sistemi interni, tenant, progetti LeanEvent operativi o dati di altri clienti.
- Non menzionare fornitori AI terzi (OpenAI, ecc.) né Jotform.
- Rispondi in italiano, tono professionale, elegante e concreto. Messaggi brevi e chiari.
- Se la richiesta esula dal sito, invita a scrivere via modulo Contatti o a prenotare una consulenza.`;

export function getTeresaPublicSystemPrompt(): string {
  return SYSTEM_PROMPT;
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
      temperature: 0.35,
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

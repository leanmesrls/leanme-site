import { Resend } from "resend";

import type { TeresaPublicThread } from "@/types/teresa-public";
import { SITE_URL } from "@/lib/metadata";

/**
 * Notifica email SOLO per Teresa pubblica (leanme-site).
 * Non usare da lean-event / tenant.
 */
export async function notifyTeresaPublicLead(
  thread: TeresaPublicThread
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.TERESA_NOTIFY_TO?.trim() || "info@leanme.it";
  const from =
    process.env.TERESA_NOTIFY_FROM?.trim() ||
    "LeanMe Teresa <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[teresa-public] RESEND_API_KEY mancante: notifica saltata.");
    return { sent: false, reason: "missing_api_key" };
  }
  if (!thread.lead) {
    return { sent: false, reason: "missing_lead" };
  }

  const resend = new Resend(apiKey);
  const lead = thread.lead;
  const preview =
    [...thread.messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content.slice(0, 280) ?? "(nessun messaggio ancora)";

  const subject = `Teresa pubblica — nuovo contatto: ${lead.firstName} ${lead.lastName}`;
  const humanUrl = `${SITE_URL}/lean-human`;

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: [
      "Nuova conversazione Teresa (sito pubblico)",
      "",
      `Nome: ${lead.firstName} ${lead.lastName}`,
      `Email: ${lead.email}`,
      `Thread: ${thread.id}`,
      `Aggiornato: ${thread.updatedAt}`,
      "",
      "Anteprima ultimo messaggio utente:",
      preview,
      "",
      `Supervisione: ${humanUrl}`,
    ].join("\n"),
  });

  if (error) {
    console.error("[teresa-public] Resend error:", error);
    return { sent: false, reason: error.message };
  }

  return { sent: true };
}

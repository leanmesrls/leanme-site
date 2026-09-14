import type { TeresaPublicThread } from "@/types/teresa-public";
import { SITE_URL } from "@/lib/metadata";

function parseFrom(
  raw: string
): { name?: string; email: string } | null {
  const trimmed = raw.trim();
  const matched = trimmed.match(/^(.*)<([^>]+)>$/);
  if (matched) {
    const name = matched[1].trim().replace(/^"|"$/g, "");
    const email = matched[2].trim();
    if (!email.includes("@")) return null;
    return name ? { name, email } : { email };
  }
  if (!trimmed.includes("@")) return null;
  return { email: trimmed };
}

/**
 * Notifica email SOLO per Teresa pubblica (leanme-site), via Brevo.
 * Non usare da lean-event / tenant.
 */
export async function notifyTeresaPublicLead(
  thread: TeresaPublicThread
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey =
    process.env.BREVO_API_KEY?.trim() ||
    process.env.SENDINBLUE_API_KEY?.trim();
  const to = (process.env.TERESA_NOTIFY_TO?.trim() || "info@leanme.it")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const from = parseFrom(
    process.env.TERESA_NOTIFY_FROM?.trim() ||
      "LeanMe Teresa <info@leanme.it>"
  );

  if (!apiKey) {
    console.warn("[teresa-public] BREVO_API_KEY mancante: notifica saltata.");
    return { sent: false, reason: "missing_api_key" };
  }
  if (!from) {
    return { sent: false, reason: "invalid_from" };
  }
  if (!to.length) {
    return { sent: false, reason: "missing_recipient" };
  }
  if (!thread.lead) {
    return { sent: false, reason: "missing_lead" };
  }

  const lead = thread.lead;
  const preview =
    [...thread.messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content.slice(0, 280) ?? "(nessun messaggio ancora)";

  const subject = `Teresa pubblica — nuova conversazione: ${lead.firstName} ${lead.lastName}`;
  const humanUrl = `${SITE_URL}/lean-human`;
  const textContent = [
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
  ].join("\n");
  const htmlContent = `<p>${textContent
    .split("\n")
    .map((line) => (line ? escapeHtml(line) : "<br>"))
    .join("<br>")}</p>`;

  try {
    const sender = await resolveVerifiedSender(apiKey, from);
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender,
        to: to.map((email) => ({ email })),
        replyTo: { email: lead.email, name: `${lead.firstName} ${lead.lastName}` },
        subject,
        textContent,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        "[teresa-public] Brevo error:",
        response.status,
        errorText,
        "sender",
        sender.email
      );
      return {
        sent: false,
        reason: `brevo_${response.status}:${truncateReason(errorText)}`,
      };
    }

    console.info("[teresa-public] notify sent", {
      threadId: thread.id,
      sender: sender.email,
    });
    return { sent: true };
  } catch (error) {
    console.error("[teresa-public] Brevo exception:", error);
    return { sent: false, reason: "brevo_exception" };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function truncateReason(raw: string): string {
  return raw.replaceAll(/\s+/g, " ").trim().slice(0, 180);
}

async function resolveVerifiedSender(
  apiKey: string,
  configured: { name?: string; email: string }
): Promise<{ name?: string; email: string }> {
  try {
    const response = await fetch("https://api.brevo.com/v3/senders", {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return configured;
    }
    const payload = (await response.json()) as {
      senders?: Array<{ email?: string; name?: string; active?: boolean }>;
    };
    const senders = (payload.senders ?? []).filter(
      (sender) => sender.email && sender.active !== false
    );
    const configuredMatch = senders.find(
      (sender) => sender.email?.toLowerCase() === configured.email.toLowerCase()
    );
    if (configuredMatch?.email) {
      return {
        email: configuredMatch.email,
        name: configured.name || configuredMatch.name,
      };
    }
    const leanme = senders.find((sender) =>
      sender.email?.toLowerCase().endsWith("@leanme.it")
    );
    if (leanme?.email) {
      console.warn("[teresa-public] sender non verificato, uso", leanme.email);
      return {
        email: leanme.email,
        name: configured.name || leanme.name,
      };
    }
  } catch (error) {
    console.warn("[teresa-public] senders lookup failed:", error);
  }
  return configured;
}

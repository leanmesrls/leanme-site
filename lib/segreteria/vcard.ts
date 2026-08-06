import type { ContactData } from "@/types/content";
import type {
  SegreteriaPersonContacts,
  SegreteriaResolvedPerson,
} from "@/types/segreteria";

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    chunks.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  return chunks.join("\r\n");
}

function linesToVCard(lines: string[]): string {
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

function splitDisplayName(name: string): { family: string; given: string } {
  const cleaned = name.replace(/^(Dr\.|Ing\.)\s+/i, "").trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return { family: parts[0], given: "" };
  }
  return {
    given: parts.slice(0, -1).join(" "),
    family: parts[parts.length - 1] ?? "",
  };
}

function addressToVCard(
  label: string,
  lines: string[]
): string | undefined {
  if (!lines.length) return undefined;
  const street = lines.slice(1, -1).join(", ") || lines[1] || "";
  const last = lines[lines.length - 1] ?? "";
  const postalMatch = last.match(/^(\d{5})\s+(.+?)(?:\s+\(([A-Z]{2})\))?$/);
  const postalCode = postalMatch?.[1] ?? "";
  const city = postalMatch?.[2] ?? last;
  const region = postalMatch?.[3] ?? "";

  return `ADR;TYPE=${label}:;;${escapeVCardValue(street)};${escapeVCardValue(city)};${escapeVCardValue(region)};${escapeVCardValue(postalCode)};Italy`;
}

export function buildCompanyVCard({
  displayName,
  organization,
  contacts,
  url,
}: {
  displayName: string;
  organization: string;
  contacts: ContactData;
  url: string;
}): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${escapeVCardValue(displayName)};;;`,
    `FN:${escapeVCardValue(displayName)}`,
    `ORG:${escapeVCardValue(organization)}`,
  ];

  if (isUsablePhone(contacts.phone.value)) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(contacts.phone.value)}`);
  }

  lines.push(`EMAIL;TYPE=INTERNET,WORK:${escapeVCardValue(contacts.email.value)}`);

  const workAddress = addressToVCard("WORK", contacts.operationalAddress.lines);
  if (workAddress) lines.push(workAddress);

  if (contacts.piva?.value) {
    lines.push(`NOTE:${escapeVCardValue(`${contacts.piva.label}: ${contacts.piva.value}`)}`);
  }

  lines.push(`URL:${escapeVCardValue(url)}`);
  lines.push("END:VCARD");

  return linesToVCard(lines);
}

export function buildPersonVCard({
  person,
  organization,
  siteUrl,
}: {
  person: SegreteriaResolvedPerson;
  organization: string;
  siteUrl: string;
}): string {
  const { family, given } = splitDisplayName(person.name);
  const contacts = person.contacts;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(family)};${escapeVCardValue(given)};;;`,
    `FN:${escapeVCardValue(person.name)}`,
    `ORG:${escapeVCardValue(organization)}`,
    `TITLE:${escapeVCardValue(person.role)}`,
  ];

  if (contacts.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(contacts.phone)}`);
  }

  if (contacts.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(contacts.email)}`);
  }

  if (contacts.linkedin) {
    lines.push(`URL:${escapeVCardValue(contacts.linkedin)}`);
  }

  lines.push(`URL:${escapeVCardValue(`${siteUrl}${person.profilePath}`)}`);
  lines.push(`NOTE:${escapeVCardValue(person.shortBio)}`);
  lines.push("END:VCARD");

  return linesToVCard(lines);
}

export function isUsablePhone(value?: string): boolean {
  if (!value?.trim()) return false;
  const digits = value.replace(/\D/g, "");
  if (!digits.length) return false;
  // Placeholder in contatti.json: +39 000 000 0000
  const national = digits.replace(/^39/, "");
  if (!national.length || /^0+$/.test(national)) return false;
  return true;
}

export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function toMailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function toWhatsAppHref(whatsapp: string): string {
  if (whatsapp.startsWith("http")) return whatsapp;
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function mapsHrefFromOperationalAddress(lines: string[]): string {
  const query = encodeURIComponent(lines.slice(1).join(", "));
  return `https://maps.google.com/?q=${query}`;
}

export function hasPersonContact(
  contacts: SegreteriaPersonContacts,
  key: keyof SegreteriaPersonContacts
): boolean {
  return Boolean(contacts[key]?.trim());
}

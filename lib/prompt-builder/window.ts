const DEFAULT_EXPIRES = "2026-11-19";

export function builderExpiresAt(): Date {
  const raw = process.env.PROMPT_BUILDER_EXPIRES?.trim() || DEFAULT_EXPIRES;
  const date = raw.length === 10 ? `${raw}T23:59:59+01:00` : raw;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(`${DEFAULT_EXPIRES}T23:59:59+01:00`);
  }
  return parsed;
}

export function builderIsOpen(now = new Date()): boolean {
  return now.getTime() <= builderExpiresAt().getTime();
}

export function builderExpiresLabel(): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(builderExpiresAt());
}

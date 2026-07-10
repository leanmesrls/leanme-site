const EU_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function formatEuropeanDate(value: string | null | undefined): string {
  if (!value?.trim()) {
    return "-";
  }

  const trimmed = value.trim();
  if (EU_DATE_REGEX.test(trimmed)) {
    return trimmed;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed;
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${parsed.getFullYear()}`;
}

export function parseEuropeanDateToIso(value: string): string | null {
  const trimmed = value.trim();
  const european = trimmed.match(EU_DATE_REGEX);
  if (european) {
    const [, day, month, year] = european;
    return `${year}-${month}-${day}`;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function todayEuropeanDate(): string {
  return formatEuropeanDate(new Date().toISOString().slice(0, 10));
}

export function normalizeMeetingDateInput(value?: string): string {
  if (!value?.trim()) {
    return new Date().toISOString().slice(0, 10);
  }

  const iso = parseEuropeanDateToIso(value);
  if (iso) {
    return iso;
  }

  throw new Error("INVALID_MEETING_DATE");
}

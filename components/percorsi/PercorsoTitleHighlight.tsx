import type { ReactNode } from "react";

const PERCORSO_TITLE_HIGHLIGHTS: Record<string, string[]> = {
  "innovare-la-mia-azienda": ["la mia azienda", "un mio progetto"],
  "partner-struttura-sanitaria": ["la mia struttura sanitaria"],
  "partner-societa-scientifica": ["la mia società scientifica"],
  "partner-eventi": ["i miei eventi"],
  "comunicare-meglio": ["comunicare"],
};

function highlightTitle(title: string, phrases: string[]): ReactNode[] {
  if (!phrases.length) return [title];

  const lower = title.toLowerCase();
  const hits: Array<{ start: number; end: number }> = [];

  for (const phrase of phrases) {
    const needle = phrase.toLowerCase();
    let from = 0;
    while (from < lower.length) {
      const index = lower.indexOf(needle, from);
      if (index === -1) break;
      hits.push({ start: index, end: index + needle.length });
      from = index + needle.length;
    }
  }

  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Array<{ start: number; end: number }> = [];
  for (const hit of hits) {
    const last = merged[merged.length - 1];
    if (last && hit.start < last.end) continue;
    merged.push(hit);
  }

  if (!merged.length) return [title];

  const nodes: ReactNode[] = [];
  let cursor = 0;
  merged.forEach((hit, index) => {
    if (hit.start > cursor) {
      nodes.push(title.slice(cursor, hit.start));
    }
    nodes.push(
      <span key={`kw-${index}`} className="text-leanme-fuchsia">
        {title.slice(hit.start, hit.end)}
      </span>
    );
    cursor = hit.end;
  });
  if (cursor < title.length) {
    nodes.push(title.slice(cursor));
  }
  return nodes;
}

export function PercorsoTitleHighlight({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  return <>{highlightTitle(title, PERCORSO_TITLE_HIGHLIGHTS[slug] ?? [])}</>;
}

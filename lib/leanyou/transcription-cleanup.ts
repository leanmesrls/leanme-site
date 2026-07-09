const HALLUCINATION_PATTERNS = [
  /(?:sottotitoli creati dalla comunità amara\.org[\s.,]*)+/gi,
  /(?:subtitles by the amara\.org community[\s.,]*)+/gi,
  /(?:grazie per aver guardato[\s.,]*)+/gi,
  /(?:thanks for watching[\s.,]*)+/gi,
  /(?:iscriviti al canale[\s.,]*)+/gi,
  /(?:subscribe to the channel[\s.,]*)+/gi,
];

export function cleanTranscriptionPart(text: string): string {
  let cleaned = text.trim();

  for (const pattern of HALLUCINATION_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ").trim();
  }

  cleaned = cleaned.replace(/\s{2,}/g, " ").trim();

  if (!cleaned) {
    return "";
  }

  const meaningful = cleaned.replace(/[^\p{L}\p{N}]/gu, "").trim();
  if (meaningful.length < 12) {
    return "";
  }

  return cleaned;
}

export function cleanFullTranscript(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((section) => {
      const withoutPartHeader = section.replace(/^#{1,3}\s*Parte\s+\d+\/\d+\s*\n?/i, "");
      return cleanTranscriptionPart(withoutPartHeader);
    })
    .filter(Boolean)
    .join("\n\n");
}

export function combineTranscriptSources(
  videoTranscript: string,
  supplementalText: string
): string {
  const cleanedVideo = cleanFullTranscript(videoTranscript);
  const cleanedSupplement = supplementalText.trim();

  if (cleanedVideo && cleanedSupplement) {
    return `${cleanedVideo}\n\n---\n\nInformazioni testuali aggiuntive:\n\n${cleanedSupplement}`;
  }

  if (cleanedVideo) {
    return cleanedVideo;
  }

  return cleanedSupplement;
}

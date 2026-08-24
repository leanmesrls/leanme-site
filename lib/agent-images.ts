/** Full homepage agent tile PNGs (portrait + icon + label baked in). */
export const AGENT_HOMEPAGE_TILE_ASPECT = "384 / 960" as const;

/** Larghezza contenuta: le tile a piena colonna risultano troppo alte in homepage. */
export const agentHomepageTileClassName =
  "aspect-[384/960] w-full max-w-[9.25rem] self-start overflow-hidden rounded-sm sm:max-w-[9.75rem] xl:max-w-[8.75rem]";

/** Compact card portraits for grids with separate HTML captions. */
export const AGENT_CARD_IMAGE_ASPECT = "379 / 415" as const;

export const agentCardImageClassName =
  "relative aspect-[379/415] w-full overflow-hidden rounded-t-xl";

export function agentCardImageSrc(slug: string): string {
  return `/assets/official/agenti-schede/${slug}-card.png`;
}

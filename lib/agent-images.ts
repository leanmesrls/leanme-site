/** Full homepage agent tile PNGs (portrait + icon + label baked in). */
export const AGENT_HOMEPAGE_TILE_ASPECT = "384 / 960" as const;

export const agentHomepageTileClassName =
  "aspect-[384/960] w-full max-w-full self-start overflow-hidden rounded-sm";

/** Compact card portraits for grids with separate HTML captions. */
export const AGENT_CARD_IMAGE_ASPECT = "379 / 415" as const;

export const agentCardImageClassName =
  "relative aspect-[379/415] w-full overflow-hidden rounded-t-xl";

export function agentCardImageSrc(slug: string): string {
  return `/assets/official/agenti-schede/${slug}-card.png`;
}

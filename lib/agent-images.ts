/** Full homepage agent tile PNGs (portrait + icon + label baked in). */
export const AGENT_HOMEPAGE_TILE_ASPECT = "384 / 960" as const;

/** Riempie la colonna della griglia (7 su xl) senza lasciare vuoto ai lati. */
export const agentHomepageTileClassName =
  "aspect-[384/960] w-full max-w-full self-start overflow-hidden rounded-sm";

/** Compact photorealistic portraits for agent profile pages (not homepage tiles). */
export const AGENT_CARD_IMAGE_ASPECT = "4 / 5" as const;

export const agentCardImageClassName =
  "relative aspect-[4/5] w-full overflow-hidden rounded-t-xl";

export function agentCardImageSrc(slug: string): string {
  return `/assets/official/agenti-schede/${slug}-portrait.jpg`;
}

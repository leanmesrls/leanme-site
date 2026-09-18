import Image from "next/image";

import { ArrowIcon } from "@/components/homepage/Icons";
import { cn } from "@/lib/utils";
import type { PercorsoVignette } from "@/types/content";

interface PercorsoVignettesProps {
  vignettes: PercorsoVignette[];
  showArrowBetweenColumns?: boolean;
}

const ARROW_COLUMN_WEIGHT = 0.4;

/** Coppie pari: nero con velatura fucsia. Coppie dispari: charcoal più chiaro, sfumato ai bordi. */
const PAIR_BAND_EVEN =
  "bg-[linear-gradient(180deg,#240814_0%,#000000_22%,#000000_78%,#14060c_100%)]";
const PAIR_BAND_ODD =
  "bg-[linear-gradient(180deg,#1f1f1f_0%,#3a3a3a_18%,#3a3a3a_82%,#1f1f1f_100%)]";

function getPairBandClass(index: number) {
  return index % 2 === 0 ? PAIR_BAND_EVEN : PAIR_BAND_ODD;
}

function getAspectRatio(vignette: PercorsoVignette) {
  const width = vignette.width ?? 1672;
  const height = vignette.height ?? 941;
  return width / height;
}

function getHeightFactor(vignette: PercorsoVignette) {
  const width = vignette.width ?? 1672;
  const height = vignette.height ?? 941;
  return height / width;
}

/** Altezza condivisa in riga: entrambe le colonne usano il fattore più alto. */
function getSharedRowHeightFactor(left: PercorsoVignette, right: PercorsoVignette) {
  return Math.max(getHeightFactor(left), getHeightFactor(right));
}

function getVisualWidthAtSharedHeight(
  vignette: PercorsoVignette,
  sharedHeightFactor: number
) {
  return getAspectRatio(vignette) * sharedHeightFactor;
}

function computeGlobalColumnVisual(rows: PercorsoVignette[][]) {
  let maxVisual = 0;

  for (const [left, right] of rows) {
    if (!right) {
      maxVisual = Math.max(maxVisual, getAspectRatio(left));
      continue;
    }

    const sharedHeightFactor = getSharedRowHeightFactor(left, right);
    maxVisual = Math.max(
      maxVisual,
      getVisualWidthAtSharedHeight(left, sharedHeightFactor),
      getVisualWidthAtSharedHeight(right, sharedHeightFactor)
    );
  }

  return maxVisual;
}

function VignetteCell({
  vignette,
  sizes,
}: {
  vignette: PercorsoVignette;
  sizes: string;
}) {
  const scale = vignette.displayScale ?? 1;

  return (
    <figure
      id={vignette.id}
      className="relative m-0 flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-white"
    >
      <div
        className="relative h-full w-full"
        style={
          scale !== 1
            ? { transform: `scale(${scale})`, transformOrigin: "center" }
            : undefined
        }
      >
        <Image
          src={vignette.image.src}
          alt={vignette.image.alt}
          fill
          className="object-contain object-center"
          sizes={sizes}
        />
      </div>
    </figure>
  );
}

function VignetteBlock({
  vignette,
  sizes,
  className,
}: {
  vignette: PercorsoVignette;
  sizes: string;
  className?: string;
}) {
  const width = vignette.width ?? 1672;
  const height = vignette.height ?? 941;
  const scale = vignette.displayScale ?? 1;

  return (
    <figure
      id={vignette.id}
      className={cn(
        "relative m-0 w-full overflow-hidden bg-white leading-none",
        className
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="relative h-full w-full"
        style={
          scale !== 1
            ? { transform: `scale(${scale})`, transformOrigin: "center" }
            : undefined
        }
      >
        <Image
          src={vignette.image.src}
          alt={vignette.image.alt}
          fill
          className="object-contain object-center"
          sizes={sizes}
        />
      </div>
    </figure>
  );
}

function VignetteArrowBadge({
  direction = "right",
}: {
  direction?: "right" | "down";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center bg-transparent",
        direction === "right"
          ? "self-center px-3 md:px-5"
          : "py-6"
      )}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-leanme-fuchsia shadow-[0_0_28px_rgba(230,0,126,0.45)] md:h-14 md:w-14">
        <ArrowIcon
          className={cn(
            "h-6 w-6 text-white md:h-7 md:w-7",
            direction === "down" && "rotate-90"
          )}
        />
      </span>
    </div>
  );
}

function DesktopVignetteRow({
  left,
  right,
  columnVisual,
  showArrowBetweenColumns,
}: {
  left: PercorsoVignette;
  right?: PercorsoVignette;
  columnVisual: number;
  showArrowBetweenColumns: boolean;
}) {
  if (!right) {
    const leftWidth = left.width ?? 1672;
    const leftHeight = left.height ?? 941;

    return (
      <div
        className="hidden w-full overflow-hidden leading-none md:block"
        style={{ aspectRatio: `${leftWidth} / ${leftHeight}` }}
      >
        <VignetteCell vignette={left} sizes="100vw" />
      </div>
    );
  }

  const sharedHeightFactor = getSharedRowHeightFactor(left, right);
  const arrowWeight = showArrowBetweenColumns ? ARROW_COLUMN_WEIGHT : 0;
  const rowWidth = columnVisual * 2 + arrowWeight;
  const rowHeight = columnVisual * sharedHeightFactor;

  return (
    <div
      className="hidden w-full gap-0 overflow-hidden leading-none md:grid"
      style={{
        gridTemplateColumns: showArrowBetweenColumns
          ? `${columnVisual}fr ${arrowWeight}fr ${columnVisual}fr`
          : `${columnVisual}fr ${columnVisual}fr`,
        aspectRatio: `${rowWidth} / ${rowHeight}`,
      }}
    >
      <VignetteCell vignette={left} sizes="45vw" />
      {showArrowBetweenColumns ? (
        <VignetteArrowBadge direction="right" />
      ) : null}
      <VignetteCell vignette={right} sizes="45vw" />
    </div>
  );
}

function MobileVignettePair({
  left,
  right,
  showArrowBetweenColumns,
}: {
  left: PercorsoVignette;
  right?: PercorsoVignette;
  showArrowBetweenColumns: boolean;
}) {
  return (
    <div className="flex flex-col gap-0 leading-none md:hidden">
      <VignetteBlock vignette={left} sizes="100vw" />
      {right ? (
        <>
          {showArrowBetweenColumns ? (
            <VignetteArrowBadge direction="down" />
          ) : null}
          <VignetteBlock vignette={right} sizes="100vw" />
        </>
      ) : null}
    </div>
  );
}

export function PercorsoVignettes({
  vignettes,
  showArrowBetweenColumns = false,
}: PercorsoVignettesProps) {
  if (vignettes.length === 0) {
    return null;
  }

  const rows: PercorsoVignette[][] = [];
  for (let index = 0; index < vignettes.length; index += 2) {
    rows.push(vignettes.slice(index, index + 2));
  }

  const columnVisual = computeGlobalColumnVisual(rows);

  return (
    <section
      aria-label="Soluzioni"
      className="bg-black pb-16 pt-6 md:pb-20 md:pt-8"
    >
      {rows.map(([left, right], index) => (
        <div key={left.id} className={cn("relative", getPairBandClass(index))}>
          <div className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-10 md:py-4 lg:px-12">
            <DesktopVignetteRow
              left={left}
              right={right}
              columnVisual={columnVisual}
              showArrowBetweenColumns={showArrowBetweenColumns}
            />
            <MobileVignettePair
              left={left}
              right={right}
              showArrowBetweenColumns={showArrowBetweenColumns}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

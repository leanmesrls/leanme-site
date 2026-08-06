import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

/**
 * Genera app/icon.png e apple-icon.png dal pittogramma ufficiale.
 * NON sovrascrive public/assets/official/pittogramma.png (usato in UI).
 * Sfondo trasparente (niente quadrato nero sulle tab scure).
 */
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcCandidates = [
  path.join(root, "public/assets/official/pittogramma.png"),
  path.join(root, "docs/assets/pittogramma.png"),
];
const src = srcCandidates.find((candidate) => fs.existsSync(candidate));
const appIcon = path.join(root, "app/icon.png");
const appAppleIcon = path.join(root, "app/apple-icon.png");

if (!src) {
  console.error("Missing pittogramma source");
  process.exit(1);
}

/** Rimuove fringe scuro dopo la punta e alone quasi-nere (AA su nero). */
async function cleanPittogrammaBuffer(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const { width, height } = info;

  let solidMaxX = 0;
  for (let x = 0; x < width; x++) {
    let solid = 0;
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      if (a < 20) continue;
      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);
      if (sat > 40 && max > 60) solid++;
    }
    if (solid >= 18) solidMaxX = x;
  }

  const clear = (i) => {
    pixels[i] = 0;
    pixels[i + 1] = 0;
    pixels[i + 2] = 0;
    pixels[i + 3] = 0;
  };

  for (let x = solidMaxX + 1; x < width; x++) {
    for (let y = 0; y < height; y++) clear((y * width + x) * 4);
  }

  for (let y = 0; y < height; y++) {
    const i = (y * width + solidMaxX) * 4;
    if (pixels[i + 3] < 20) continue;
    const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
    const sat = max - Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (max < 50 && sat < 50) clear(i);
  }

  // Alone quasi-nere (AA su nero) → pixel neri visibili sulle tab
  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a < 12) {
      clear(i);
      continue;
    }
    const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
    const sat = max - Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (max < 36 || (max < 55 && sat < 28)) {
      clear(i);
    }
  }

  return sharp(pixels, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 0 })
    .png()
    .toBuffer();
}

async function squarePng(input, size, output) {
  await sharp(input)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(output);

  const meta = await sharp(output).metadata();
  console.log(`${path.basename(output)} → ${meta.width}x${meta.height}`);
}

const cleaned = await cleanPittogrammaBuffer(src);
await squarePng(cleaned, 512, appIcon);
await squarePng(cleaned, 180, appAppleIcon);
console.log(
  "Favicon synced from",
  path.relative(root, src),
  "(transparent + fringe cleaned)"
);

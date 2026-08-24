/**
 * Allinea pittogramma + favicon al logo ufficiale pink-white
 * (stesso rosa/viola del wordmark header, non il master pittogramma separato).
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const eventRoot = path.join(root, "..", "leanme-event");
const logoSrc = path.join(
  root,
  "public/assets/official/logo-official_pink-white.png"
);

if (!fs.existsSync(logoSrc)) {
  console.error("Missing", logoSrc);
  process.exit(1);
}

async function extractPittogrammaFromLogo(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.alloc(data.length, 0);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 20) continue;

      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);

      // Solo pallini colorati (rosa/viola), non testo bianco
      const isPinkViolet =
        sat > 22 && max > 35 && r > 35 && r + 10 >= g && r >= b * 0.55;
      if (!isPinkViolet) continue;

      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
      pixels[i + 3] = 255;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error("Nessun pixel rosa/viola trovato nel logo");
  }

  return sharp(pixels, { raw: { width, height, channels } })
    .trim({ threshold: 0 })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const pittoRaw = await extractPittogrammaFromLogo(logoSrc);
const pitto = await sharp(pittoRaw)
  .resize({
    width: 420,
    height: 540,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toBuffer();
const meta = await sharp(pitto).metadata();
console.log(`pittogramma from logo → ${meta.width}x${meta.height}`);

const targets = [
  path.join(root, "public/assets/official/pittogramma.png"),
  path.join(root, "docs/assets/pittogramma.png"),
];

if (fs.existsSync(eventRoot)) {
  targets.push(
    path.join(eventRoot, "public/assets/official/pittogramma.png"),
    path.join(eventRoot, "docs/assets/pittogramma.png")
  );
}

for (const dest of targets) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, pitto);
  console.log("wrote", dest);
}

execFileSync(process.execPath, [path.join(root, "scripts/sync-favicon.mjs")], {
  cwd: root,
  stdio: "inherit",
});

if (fs.existsSync(path.join(eventRoot, "scripts/sync-favicon.mjs"))) {
  execFileSync(
    process.execPath,
    [path.join(eventRoot, "scripts/sync-favicon.mjs")],
    { cwd: eventRoot, stdio: "inherit" }
  );
}

console.log("Done: pittogramma + favicons aligned to header logo.");

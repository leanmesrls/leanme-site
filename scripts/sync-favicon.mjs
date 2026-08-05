import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

/**
 * Genera app/icon.png e apple-icon.png dal pittogramma ufficiale.
 * NON sovrascrive public/assets/official/pittogramma.png (usato in UI).
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

async function squarePng(input, size, output) {
  await sharp(input)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(output);

  const meta = await sharp(output).metadata();
  console.log(`${path.basename(output)} → ${meta.width}x${meta.height}`);
}

await squarePng(src, 512, appIcon);
await squarePng(src, 180, appAppleIcon);
console.log("Favicon synced from", path.relative(root, src));

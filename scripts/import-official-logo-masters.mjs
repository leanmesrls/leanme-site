/**
 * Importa i master logo LeanMe ufficiali (allegati) → PNG trasparenti su
 * leanme-site e leanme-event.
 *
 * Usage:
 *   node scripts/import-official-logo-masters.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const eventRoot = path.join(root, "..", "leanme-event");
const mastersDir = path.join(
  process.env.USERPROFILE || "",
  ".cursor/projects/c-Cursor-leanme-site/assets"
);

const MASTERS = {
  pinkWhite:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_LOGO_DEF_bianco_e_rosa-d4abedd6-07a6-49cf-8655-ddba4299acf5.png",
  white:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_logo_bianco-3bb4b34e-e644-4098-8b8f-83fbce8d176e.png",
  blackPink:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_LOGO_DEF_nero_e_rosa-1d467a4f-48de-4bc5-bd7f-5b6e9d389b83.png",
  pittogramma:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_pittogramma-9f6fab46-bdc0-4454-ab08-599f29699aec.png",
  pittogrammaWhite:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_pittogramma_bianco-25ad2954-2d12-4f55-99ac-c3e4540becd7.png",
  pittogrammaBlack:
    "c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_pittogramma_nero-a32286cd-b9f1-4dd7-8e75-16ef75aa2c6a.png",
};

function masterPath(key) {
  return path.join(mastersDir, MASTERS[key]);
}

/** Sfondo nero → trasparente; mantiene rosa/bianco/grigio. */
async function knockoutBlackBackground(inputPath, { blackThreshold = 28 } = {}) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const sat = max - Math.min(r, g, b);

    // Non toccare i pixel colorati (pittogramma rosa/viola)
    if (sat > 22 && max > blackThreshold) {
      continue;
    }

    if (max <= blackThreshold) {
      pixels[i + 3] = 0;
      continue;
    }

    if (max <= blackThreshold + 28) {
      const fade = (max - blackThreshold) / 28;
      pixels[i + 3] = Math.min(pixels[i + 3], Math.round(fade * 255));
    }
  }

  return sharp(pixels, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 0 })
    .toBuffer();
}

/** Da logo chiaro-su-nero: testo/icone chiare → nero pieno (per fondi chiari). */
async function recolorLightLogoToBlack(transparentPng) {
  const { data, info } = await sharp(transparentPng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const a = pixels[i + 3];
    if (a < 12) {
      pixels[i + 3] = 0;
      continue;
    }

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const sat = max - Math.min(r, g, b);

    // Mantieni rosa/viola
    if (sat > 22 && r > 40) {
      pixels[i + 3] = 255;
      continue;
    }

    // Bianco / grigio → nero pieno (niente outline)
    pixels[i] = 0;
    pixels[i + 1] = 0;
    pixels[i + 2] = 0;
    pixels[i + 3] = 255;
  }

  return sharp(pixels, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 0 })
    .toBuffer();
}

/** Ritaglia solo i pixel colorati (pittogramma), ignora rumore JPEG. */
async function knockoutColoredMark(inputPath, { blackThreshold = 24 } = {}) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.alloc(data.length, 0);

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);

      const isMark =
        (sat > 18 && max > blackThreshold) ||
        (sat <= 18 && max > 40); // bianco/grigio su pittogramma bianco

      if (!isMark) continue;

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

  const pad = 4;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const cropW = Math.min(width - left, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(height - top, maxY - minY + 1 + pad * 2);

  return sharp(pixels, { raw: { width, height, channels } })
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toBuffer();
}

async function finalize(buffer, outPath, width = 2200) {
  await sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`  ${path.basename(outPath)} → ${meta.width}x${meta.height}`);
}

async function writeToRoots(outputs) {
  const roots = [root];
  if (fs.existsSync(eventRoot)) roots.push(eventRoot);

  for (const projectRoot of roots) {
    const official = path.join(projectRoot, "public", "assets", "official");
    const docs = path.join(projectRoot, "docs", "assets");
    const mastersOut = path.join(docs, "logo-masters");
    fs.mkdirSync(official, { recursive: true });
    fs.mkdirSync(docs, { recursive: true });
    fs.mkdirSync(mastersOut, { recursive: true });

    console.log(`\n→ ${projectRoot}`);

    for (const [filename, buffer] of Object.entries(outputs)) {
      const width = filename.startsWith("pittogramma") ? 800 : 2200;
      const out = path.join(official, filename);
      await finalize(buffer, out, width);
      fs.copyFileSync(out, path.join(docs, filename));
    }

    // Copia master grezzi in docs (archivio)
    for (const [key, file] of Object.entries(MASTERS)) {
      const src = masterPath(key);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(mastersOut, path.basename(file)));
      }
    }
  }
}

for (const [key, file] of Object.entries(MASTERS)) {
  const p = masterPath(key);
  if (!fs.existsSync(p)) {
    throw new Error(`Master mancante (${key}): ${p}`);
  }
}

console.log("Processo master ufficiali…");

const pinkWhite = await knockoutBlackBackground(masterPath("pinkWhite"), {
  blackThreshold: 30,
});
const white = await knockoutBlackBackground(masterPath("white"), {
  blackThreshold: 30,
});
// Nero+rosa: LeanMe è nero-su-nero nel master → deriva da bianco+rosa
const blackFromPinkWhite = await recolorLightLogoToBlack(pinkWhite);

const pittogrammaRaw = await knockoutColoredMark(masterPath("pinkWhite"), {
  blackThreshold: 24,
});
// Solo pallini colorati (stesso hue del logo header), senza testo bianco
{
  const { data, info } = await sharp(pittogrammaRaw)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += info.channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    if (a < 12) continue;
    const max = Math.max(r, g, b);
    const sat = max - Math.min(r, g, b);
    if (!(sat > 28 && r >= g && max > 40)) {
      pixels[i + 3] = 0;
    }
  }
  var pittogramma = await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .trim({ threshold: 0 })
    .png()
    .toBuffer();
}
const pittogrammaWhite = await knockoutColoredMark(
  masterPath("pittogrammaWhite"),
  { blackThreshold: 24 }
);
const pittogrammaBlack = await recolorLightLogoToBlack(pittogrammaWhite);

await writeToRoots({
  "logo-official_pink-white.png": pinkWhite,
  "logo-official_white.png": white,
  "logo-official_black.png": blackFromPinkWhite,
  "logo-official.png": pinkWhite,
  "pittogramma.png": pittogramma,
  "pittogramma_bianco.png": pittogrammaWhite,
  "pittogramma_nero.png": pittogrammaBlack,
});

console.log("\nFatto. Header/footer e pittogramma/favicon condividono lo stesso rosa del logo.");

/**
 * Importa il nuovo logo LeanMe (nero+rosa su nero) e genera le varianti ufficiali.
 *
 * L'export allegato ha "LeanMe" in nero su nero (illeggibile): ricostruiamo
 * il wordmark in bianco/nero e manteniamo pittogramma + tagline dall'immagine.
 *
 * Usage: node scripts/import-logo-def-nero-rosa.mjs [path-to-source]
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE =
  process.argv[2] ||
  "C:/Users/siyaa/.cursor/projects/c-Cursor-leanme-site/assets/c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_LOGO_DEF_nero_e_rosa-50d71028-e1ef-4056-b54b-ed517154b7c9.png";

const EVENT_ROOT = path.join(root, "..", "leanme-event");

async function extractLayers(srcPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const icon = Buffer.alloc(data.length, 0);
  const tagline = Buffer.alloc(data.length, 0);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    // Magenta/purple dots (pittogramma)
    if (sat > 20 && r > 30 && r >= g - 10) {
      icon[i] = r;
      icon[i + 1] = g;
      icon[i + 2] = b;
      icon[i + 3] = 255;
      continue;
    }

    // Grey tagline "Open Innovation Hub"
    if (max > 45 && max < 190 && sat < 30) {
      tagline[i] = r;
      tagline[i + 1] = g;
      tagline[i + 2] = b;
      tagline[i + 3] = 255;
    }
  }

  const iconPng = await sharp(icon, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 0 })
    .toBuffer();

  const taglinePng = await sharp(tagline, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 0 })
    .toBuffer();

  return { iconPng, taglinePng };
}

async function buildWordmarkLogo({
  iconPng,
  taglinePng,
  wordmarkColor,
  outPath,
}) {
  const iconMeta = await sharp(iconPng).metadata();
  const tagMeta = await sharp(taglinePng).metadata();

  const iconH = 420;
  const iconW = Math.round(
    ((iconMeta.width || 1) / (iconMeta.height || 1)) * iconH
  );

  const tagH = 90;
  const tagW = Math.round(
    ((tagMeta.width || 1) / (tagMeta.height || 1)) * tagH
  );

  const wordmarkFontSize = 210;
  // Approximate LeanMe width for layout
  const wordmarkW = Math.max(tagW, Math.round(wordmarkFontSize * 3.55));
  const gapIconText = 72;
  const gapWordTag = 36;
  const padX = 40;
  const padY = 40;

  const textBlockH = wordmarkFontSize + gapWordTag + tagH;
  const canvasH = Math.max(iconH, textBlockH) + padY * 2;
  const canvasW = padX + iconW + gapIconText + wordmarkW + padX;

  const iconTop = Math.round((canvasH - iconH) / 2);
  const textLeft = padX + iconW + gapIconText;
  const wordTop = Math.round((canvasH - textBlockH) / 2) + Math.round(wordmarkFontSize * 0.78);
  const tagTop = Math.round((canvasH - textBlockH) / 2) + wordmarkFontSize + gapWordTag;

  const wordmarkSvg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
  <text
    x="${textLeft}"
    y="${wordTop}"
    fill="${wordmarkColor}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${wordmarkFontSize}"
    font-weight="700"
    letter-spacing="-2"
  >LeanMe</text>
</svg>`);

  const resizedIcon = await sharp(iconPng)
    .resize({ width: iconW, height: iconH, fit: "contain" })
    .png()
    .toBuffer();

  const resizedTag = await sharp(taglinePng)
    .resize({ width: tagW, height: tagH, fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: resizedIcon, left: padX, top: iconTop },
      { input: wordmarkSvg, left: 0, top: 0 },
      {
        input: resizedTag,
        left: textLeft + Math.round((wordmarkW - tagW) / 2),
        top: tagTop,
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(
    `${path.basename(outPath)} → ${meta.width}x${meta.height} (alpha)`
  );
}

async function writeOutputs(targets) {
  const { iconPng, taglinePng } = await extractLayers(SOURCE);

  for (const targetRoot of targets) {
    const officialDir = path.join(targetRoot, "public", "assets", "official");
    const docsDir = path.join(targetRoot, "docs", "assets");
    fs.mkdirSync(officialDir, { recursive: true });
    fs.mkdirSync(docsDir, { recursive: true });

    const pittogrammaPath = path.join(officialDir, "pittogramma.png");
    await sharp(iconPng)
      .resize({ width: 800, withoutEnlargement: false })
      .png({ compressionLevel: 9 })
      .toFile(pittogrammaPath);
    fs.copyFileSync(pittogrammaPath, path.join(docsDir, "pittogramma.png"));
    console.log(`pittogramma.png → ${targetRoot}`);

    const pinkWhite = path.join(officialDir, "logo-official_pink-white.png");
    const white = path.join(officialDir, "logo-official_white.png");
    const black = path.join(officialDir, "logo-official_black.png");
    const def = path.join(officialDir, "logo-official.png");

    await buildWordmarkLogo({
      iconPng,
      taglinePng,
      wordmarkColor: "#FFFFFF",
      outPath: pinkWhite,
    });
    await buildWordmarkLogo({
      iconPng,
      taglinePng,
      wordmarkColor: "#FFFFFF",
      outPath: white,
    });
    await buildWordmarkLogo({
      iconPng,
      taglinePng,
      wordmarkColor: "#111111",
      outPath: black,
    });
    fs.copyFileSync(pinkWhite, def);

    for (const file of [
      "logo-official_pink-white.png",
      "logo-official_white.png",
      "logo-official_black.png",
      "logo-official.png",
    ]) {
      fs.copyFileSync(
        path.join(officialDir, file),
        path.join(docsDir, file)
      );
    }

    // Keep SVG slots pointing to raster for now (source of truth is PNG).
    // Also store source master.
    const master = path.join(docsDir, "logo-def-nero-rosa-source.jpg");
    fs.copyFileSync(SOURCE, master);
  }
}

const targets = [root];
if (fs.existsSync(EVENT_ROOT)) {
  targets.push(EVENT_ROOT);
} else {
  console.warn("leanme-event non trovato accanto al sito — aggiorno solo leanme-site");
}

await writeOutputs(targets);
console.log("Logo LeanMe aggiornato (sito + LeanEvent se presente). Newsletter esclusa.");

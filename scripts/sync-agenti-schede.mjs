import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = path.join(root, "docs/assets/agenti-schede");
const publicDir = path.join(root, "public/assets/official/agenti-schede");

const AGENT_SLUGS = [
  "leonardo",
  "vespucci",
  "marconi",
  "angela",
  "galileo",
  "olivetti",
  "teresa",
];

const IMAGE_PATTERN = /\.(png|jpe?g|webp)$/i;
const PORTRAIT_WIDTH = 800;
const PORTRAIT_HEIGHT = 1000;

/** Extra-tall source photos: keep the face, crop from the top. */
const PORTRAIT_POSITION = {
  vespucci: "north",
  marconi: "north",
  leonardo: "centre",
  angela: "centre",
  galileo: "centre",
  olivetti: "centre",
  teresa: "centre",
};

if (!fs.existsSync(docsDir)) {
  console.error("Missing source folder:", docsDir);
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });

function resolveSource(slug, suffix) {
  const candidates = [
    `${slug}${suffix}.png`,
    `${slug}${suffix}.jpg`,
    `${slug}${suffix}.jpeg`,
    `${slug}${suffix}.webp`,
    `${slug}-${suffix}.png`,
    `${slug}-${suffix}.jpg`,
    `${slug}-${suffix}.jpeg`,
    `${slug}-${suffix}.webp`,
  ].map((name) => path.join(docsDir, name));

  return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}

async function syncPng(src, destName) {
  const dest = path.join(publicDir, destName);
  const buffer = await sharp(src).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(dest, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`${destName} ← ${path.basename(src)} → ${meta.width}x${meta.height}`);
}

async function syncPortrait(src, destName, slug) {
  const dest = path.join(publicDir, destName);
  const buffer = await sharp(src)
    .rotate()
    .resize(PORTRAIT_WIDTH, PORTRAIT_HEIGHT, {
      fit: "cover",
      position: PORTRAIT_POSITION[slug] ?? "attention",
    })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(dest, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`${destName} ← ${path.basename(src)} → ${meta.width}x${meta.height}`);
}

let synced = 0;

for (const slug of AGENT_SLUGS) {
  const scheda =
    resolveSource(slug, "-scheda") ??
    resolveSource(slug, "_scheda") ??
    resolveSource(slug, "-scheda-tecnica");
  const source = scheda ?? resolveSource(slug, "");

  if (source) {
    await syncPng(source, `${slug}.png`);
    synced += 1;
  } else {
    console.warn(`Skip scheda ${slug}: no source image`);
  }

  const portrait = resolveSource(slug, "-portrait") ?? resolveSource(slug, "_portrait");
  if (portrait) {
    await syncPortrait(portrait, `${slug}-portrait.jpg`, slug);
    synced += 1;
  }
}

const looseFiles = fs
  .readdirSync(docsDir)
  .filter((file) => IMAGE_PATTERN.test(file));

for (const file of looseFiles) {
  const normalized = file.toLowerCase().replace(/\s+/g, "-");
  const isKnown =
    AGENT_SLUGS.some((slug) => normalized.startsWith(`${slug}.`)) ||
    AGENT_SLUGS.some((slug) => normalized.startsWith(`${slug}-scheda`)) ||
    AGENT_SLUGS.some((slug) => normalized.startsWith(`${slug}-portrait`)) ||
    AGENT_SLUGS.some((slug) => normalized.startsWith(`${slug}_portrait`));

  if (isKnown) {
    continue;
  }

  const dest = path.join(publicDir, normalized);
  if (fs.existsSync(dest)) {
    continue;
  }

  await syncPng(path.join(docsDir, file), normalized);
  synced += 1;
}

if (synced === 0) {
  console.error("No agent images found in docs/assets/agenti-schede/");
  console.error("Expected names like leonardo.png or leonardo-portrait.jpg");
  process.exit(1);
}

console.log(`Synced ${synced} file(s) to public/assets/official/agenti-schede/`);

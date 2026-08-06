#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "docs/assets/leanlab");
const destDir = path.join(root, "public/assets/leanlab");

if (!existsSync(srcDir)) {
  console.error("Cartella sorgente mancante:", srcDir);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

const files = readdirSync(srcDir).filter((name) =>
  /^newsletter-episodio-\d+\.(png|jpe?g|webp)$/i.test(name)
);

if (!files.length) {
  console.error("Nessun PNG newsletter trovato in docs/assets/leanlab/");
  console.error("Salva i file come newsletter-episodio-NN.png e rilancia.");
  process.exit(1);
}

for (const name of files) {
  const src = path.join(srcDir, name);
  const dest = path.join(destDir, name);
  copyFileSync(src, dest);
  console.log(`Newsletter copiata in: ${dest}`);
}

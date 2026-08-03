#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "docs/assets/leanlab/newsletter-episodio-00.png");
const destDir = path.join(root, "public/assets/leanlab");
const dest = path.join(destDir, "newsletter-episodio-00.png");

if (!existsSync(src)) {
  console.error("File sorgente mancante:");
  console.error(`  ${src}`);
  console.error("");
  console.error("Salva il PNG della newsletter in docs/assets/leanlab/ e rilancia.");
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Newsletter copiata in: ${dest}`);

#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, process.env.LEANYOU_DATA_DIR ?? ".leanyou-data");
const tenantsPath = path.join(dataDir, "tenants.json");

async function main() {
  const raw = await readFile(tenantsPath, "utf8");
  const minified = JSON.stringify(JSON.parse(raw));

  console.log("");
  console.log("=== Vercel → Settings → Environment Variables ===");
  console.log("");
  console.log("Name: LEANYOU_TENANTS_JSON");
  console.log("Value (incolla tutta la riga sotto):");
  console.log("");
  console.log(minified);
  console.log("");
  console.log("Ambiente consigliato: Production (+ Preview se serve demo)");
  console.log("");
}

main().catch((error) => {
  console.error(
    "Errore: esegui prima `npm run leanyou:access` per generare tenants.json"
  );
  console.error(error.message);
  process.exit(1);
});

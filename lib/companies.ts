import crypto from "crypto";
import fs from "fs";
import path from "path";

const PUBLIC_COMPANIES_DIR = path.join(process.cwd(), "public", "assets", "companies");

/** File non-logo / duplicati noti finiti nella cartella companies. */
const EXCLUDED_LOGO_PATTERN =
  /(^|-)hp\.|ui-chi-siamo|chi-siamo|leonardo|vespucci|marconi|angela|galileo|olivetti|teresa|world-sympoia-on-pulmonary-hypertension/i;

export interface PartnerLogo {
  name: string;
  logo: string;
  alt: string;
}

function displayName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

/** Elenco loghi partner ufficiali — legge da public/assets/companies */
export function getPartnerLogos(): PartnerLogo[] {
  if (!fs.existsSync(PUBLIC_COMPANIES_DIR)) return [];

  const files = fs
    .readdirSync(PUBLIC_COMPANIES_DIR)
    .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file))
    .filter((file) => !EXCLUDED_LOGO_PATTERN.test(file))
    .sort((a, b) => a.localeCompare(b, "it"));

  const seenHashes = new Set<string>();
  const logos: PartnerLogo[] = [];

  for (const file of files) {
    const fullPath = path.join(PUBLIC_COMPANIES_DIR, file);
    const hash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(fullPath))
      .digest("hex");

    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    const name = displayName(file);
    logos.push({
      name,
      logo: `/assets/companies/${file}`,
      alt: name,
    });
  }

  return logos;
}

import crypto from "crypto";
import fs from "fs";
import path from "path";
import partnerLinks from "@/data/partner-links.json";

const PUBLIC_COMPANIES_DIR = path.join(process.cwd(), "public", "assets", "companies");

/** File non-logo / duplicati noti finiti nella cartella companies. */
const EXCLUDED_LOGO_PATTERN =
  /(^|-)hp\.|ui-chi-siamo|chi-siamo|leonardo-hp|vespucci-hp|marconi-hp|angela-hp|galileo-hp|olivetti-hp|teresa-hp|world-sympoia-on-pulmonary-hypertension/i;

interface PartnerLinkMeta {
  name?: string;
  url?: string;
  alt?: string;
}

const PARTNER_LINKS = partnerLinks as Record<string, PartnerLinkMeta>;

export interface PartnerLogo {
  name: string;
  logo: string;
  alt: string;
  url?: string;
}

function displayName(slug: string): string {
  return PARTNER_LINKS[slug]?.name ?? slug;
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

    const slug = file.replace(/\.[^.]+$/, "");
    const meta = PARTNER_LINKS[slug];
    const name = displayName(slug);
    logos.push({
      name,
      logo: `/assets/companies/${file}`,
      alt: meta?.alt ?? name,
      url: meta?.url,
    });
  }

  return logos;
}

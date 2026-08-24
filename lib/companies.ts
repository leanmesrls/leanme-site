import fs from "fs";
import path from "path";

const PUBLIC_COMPANIES_DIR = path.join(process.cwd(), "public", "assets", "companies");

/** File non-logo finiti per errore nella cartella companies. */
const EXCLUDED_LOGO_PATTERN =
  /(^|-)hp\.|ui-chi-siamo|chi-siamo|leonardo|vespucci|marconi|angela|galileo|olivetti|teresa/i;

function slugify(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface PartnerLogo {
  name: string;
  logo: string;
  alt: string;
}

function mapFiles(files: string[], urlPrefix: string): PartnerLogo[] {
  return files.sort((a, b) => a.localeCompare(b, "it")).map((file) => {
    const slug = slugify(file);
    const publicName = `${slug}${path.extname(file).toLowerCase()}`;
    const name = file.replace(/\.[^.]+$/, "");

    return {
      name,
      logo: `${urlPrefix}/${publicName}`,
      alt: name,
    };
  });
}

/** Elenco loghi partner ufficiali — legge da public/assets/companies */
export function getPartnerLogos(): PartnerLogo[] {
  if (!fs.existsSync(PUBLIC_COMPANIES_DIR)) return [];

  const files = fs
    .readdirSync(PUBLIC_COMPANIES_DIR)
    .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file))
    .filter((file) => !EXCLUDED_LOGO_PATTERN.test(file));

  return mapFiles(files, "/assets/companies");
}

import {
  getAcademyData,
  getChiSiamoData,
  getContattiData,
  getHomepageData,
  getLeanLabArticles,
  getLeanLabCategories,
  getLeanLabPageData,
  getPercorsiData,
  getSiteConfig,
  getStaffData,
  getSuiteData,
} from "@/lib/content";
import type { AcademyData, LeanLabArticle } from "@/types/content";

function asText(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value.join(" ") : value;
}

function isPlaceholderPhone(value: string): boolean {
  return /000\s*000/.test(value);
}

function sortArticlesNewestFirst(articles: LeanLabArticle[]): LeanLabArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function formatLeanLabCatalog(): string {
  const page = getLeanLabPageData();
  const categories = getLeanLabCategories();
  const articles = sortArticlesNewestFirst(getLeanLabArticles());
  const categoryTitle = new Map(
    categories.map((category) => [category.slug, category.title])
  );

  const categoryLines = categories
    .map(
      (category) =>
        `- ${category.title} (${category.slug}): ${category.description}`
    )
    .join("\n");

  const articleLines = articles
    .map((article) => {
      const category = categoryTitle.get(article.category) ?? article.category;
      const excerpt = asText(article.excerpt);
      const summary = article.inPocheParole?.length
        ? article.inPocheParole.join(" ")
        : excerpt;
      const cta = article.cta
        ? ` CTA: ${article.cta.label} → ${article.cta.href}`
        : "";
      const video = article.videoCta
        ? ` Video: ${article.videoCta.label} → ${article.videoCta.href}`
        : "";
      return `- ${article.title} (${article.date}, ${category}) → /leanlab/articolo/${article.slug}
  ${summary}${cta}${video}`;
    })
    .join("\n");

  return `LEANLAB — catalogo completo aggiornato a ogni messaggio (${articles.length} articoli).
${asText(page.pageIntro.descriptions)}
Categorie:
${categoryLines}
Articoli (dal più recente):
${articleLines || "- Nessun articolo pubblicato."}`;
}

function formatAcademyCatalog(academy: AcademyData): string {
  const live = academy.pageStatus === "live";
  const resources = academy.publicArea.resources
    .map((resource) => `- ${resource.title} (${resource.type}): ${resource.description} → ${resource.href}`)
    .join("\n");
  const features = academy.reservedArea.features.join("; ");

  if (!live) {
    return `LEAN ACADEMY — stato pagina /lean-academy: Coming Soon.
${academy.intro.description}
Non dire che video, guide, webinar o corsi sono già disponibili. Invita a iscriversi alla newsletter o a tornare su /lean-academy.
In preparazione: ${academy.publicArea.title} (${academy.publicArea.description}) e ${academy.reservedArea.title} (${academy.reservedArea.description}; ${features}).
Catalogo risorse previsto (non ancora online):
${resources}`;
  }

  return `LEAN ACADEMY — stato pagina /lean-academy: pubblicata.
${academy.intro.description}
${academy.publicArea.title}: ${academy.publicArea.description}
${resources}
${academy.reservedArea.title}: ${academy.reservedArea.description} (${features})`;
}

export function buildTeresaPublicKnowledge(): string {
  const site = getSiteConfig();
  const contacts = getContattiData();
  const homepage = getHomepageData();
  const percorsi = getPercorsiData();
  const chiSiamo = getChiSiamoData();
  const staff = getStaffData();
  const suite = getSuiteData();
  const academy = getAcademyData();

  const legal = contacts.legalAddress.lines.join(", ");
  const operational = contacts.operationalAddress.lines.join(", ");
  const phone =
    contacts.phone?.value && !isPlaceholderPhone(contacts.phone.value)
      ? contacts.phone.value
      : null;
  const hours = contacts.openingHours?.lines.join(", ") ?? "";
  const piva = contacts.piva?.value ? ` P.IVA ${contacts.piva.value}.` : "";
  const pec = contacts.pec?.value ? ` PEC: ${contacts.pec.value}.` : "";

  const percorsoBlocks = percorsi.percorsi
    .map((percorso) => {
      const services = percorso.services?.length
        ? `Servizi: ${percorso.services.join("; ")}.`
        : "";
      const summary = asText(percorso.shortDescription);
      return `- ${percorso.title} → /come-possiamo-aiutarti/${percorso.slug}
  ${summary}
  ${services}`;
    })
    .join("\n");

  const people = staff.people
    .map((person) => `- ${person.name} (${person.role}): ${person.description}`)
    .join("\n");

  const agents = staff.leanAgents
    .map(
      (agent) =>
        `- Lean.Agent.${agent.name}: ${agent.role}. ${agent.description}`
    )
    .join("\n");

  const suiteTools = suite.tools
    .map((tool) => {
      const status = tool.status === "live" ? "attivo" : "in arrivo";
      const link = tool.href ? ` ${tool.href}` : "";
      return `- ${tool.name} (${status}): ${tool.description}${link}`;
    })
    .join("\n");

  return `CONOSCENZA UFFICIALE DEL SITO (ricostruita a ogni messaggio dai JSON pubblici, non contraddire):

IDENTITÀ
- Azienda: ${site.company}. Digital Innovation Company. Claim: ${site.claim}
- ${site.claimSecondary}
- LeanMe NON è una software house generica e NON è “solo grafica”: progetta Aziende Ibride (persone + Lean.Agent AI, automazione, design, comunicazione, healthcare, processi).
- Sì, realizziamo siti internet, landing page, identità visiva, contenuti, social, newsletter e automazioni. È scritto nel percorso “Voglio comunicare meglio” (/come-possiamo-aiutarti/comunicare-meglio) e nel modulo Suite LeanWebsites & Apps.
- Sede: Bologna. Sede legale: ${legal}. Sede operativa (Open Innovation Hub): ${operational}.
- Email: ${contacts.email.value}.${pec}${piva}${hours ? ` Orari: ${hours}.` : ""}${phone ? ` Telefono: ${phone}.` : " Non citare numeri di telefono se non sono pubblicati."}
- Homepage: ${homepage.hero.headlinePrefix} ${asText(homepage.hero.paragraphs)}

PAGINE DA CITARE
- Home /
- Chi siamo /chi-siamo — ${chiSiamo.intro.subtitle}. Lean Thinking, Azienda Ibrida, manifesto.
- Staff Ibrido /staff-ibrido
- Come possiamo aiutarti /come-possiamo-aiutarti — soluzioni pronte e progetti su misura
- LeanLab /leanlab
- Lean Academy /lean-academy${academy.pageStatus === "coming_soon" ? " (Coming Soon: non inventare corsi live)" : ""}
- Suite /suite
- Contatti /contatti — modulo Connect
- Prenota consulenza /prenota-consulenza — 30 minuti gratuiti
- Newsletter /newsletter
- Dicono di noi /dicono-di-noi
- vCards /vcards
- LeanEvent (area riservata eventi): https://event.leanme.it/lean-event

PERCORSI
${asText(percorsi.intro.description)}
${percorsoBlocks}

FATTI DA NON NEGARE
- Sì, facciamo siti web e landing page (comunicare meglio; servizi: Siti web e landing page, strategia contenuti, social, newsletter, brand).
- Sì, siamo a Bologna (Via Porrettana).
- Sì, lavoriamo su innovazione aziendale, sanità, società scientifiche, eventi e comunicazione.
- Sì, sviluppiamo soluzioni digitali e piattaforme (anche su misura), con metodo: prima il problema, poi la tecnologia.

TEAM UMANO
${people}

LEAN.AGENT
${agents}

SUITE
${asText(suite.intro.description)}
${suiteTools}

${formatAcademyCatalog(academy)}

${formatLeanLabCatalog()}

CTA
- Per un progetto: /contatti o /prenota-consulenza
- Per eventi già clienti: https://event.leanme.it/lean-event
`;
}

import {
  getAcademyData,
  getChiSiamoData,
  getContattiData,
  getHomepageData,
  getLeanLabArticles,
  getPercorsiData,
  getSiteConfig,
  getStaffData,
  getSuiteData,
} from "@/lib/content";

function asText(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value.join(" ") : value;
}

function isPlaceholderPhone(value: string): boolean {
  return /000\s*000/.test(value);
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
  const articles = getLeanLabArticles().slice(0, 6);

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

  const academyResources = academy.publicArea.resources
    .map((resource) => `- ${resource.title} (${resource.type}): ${resource.description}`)
    .join("\n");

  const leanlab = articles
    .map((article) => `- ${article.title} → /leanlab/articolo/${article.slug}`)
    .join("\n");

  return `CONOSCENZA UFFICIALE DEL SITO (fonte di verità, non contraddire):

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
- Lean Academy /lean-academy (contenuti formativi in arrivo; non inventare corsi live)
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

LEAN ACADEMY
${academy.intro.description} Area pubblica prevista: ${academy.publicArea.description}
${academyResources}
Area riservata prevista: ${academy.reservedArea.description}

LEANLAB (articoli recenti)
${leanlab}

CTA
- Per un progetto: /contatti o /prenota-consulenza
- Per eventi già clienti: https://event.leanme.it/lean-event
`;
}

# LEANME — DESIGN SYSTEM E BRAND STYLE GUIDE

Documento tecnico ricavato dal repository del sito LeanMe (`leanme-site`).  
Fonte per Lean.Shared.Identity.BrandDNA e per la coerenza dei contenuti prodotti dagli Agenti AI.

**Regola:** descrive esclusivamente lo stile implementato. Dove un’informazione non è definita nel codice: `NON DEFINITO NEL PROGETTO`.

**Fonti principali:** `styles/globals.css`, `docs/brand.md`, `docs/content.md`, `docs/codex.md`, `data/site.json`, `data/homepage.json`, `app/layout.tsx`, `app/page.tsx`, componenti in `components/`, `lib/assets.ts`.

---

## 1. IDENTITÀ E POSIZIONAMENTO

**Posizionamento espresso dal sito**

- Digital Innovation Company (`data/site.json`, `data/homepage.json` footer).
- Progetta **Aziende Ibride** tramite Intelligenza Artificiale, automazione e trasformazione digitale (`data/site.json` SEO; `docs/brand.md`; `docs/codex.md`: «LeanMe is not a software house. LeanMe builds Hybrid Companies.»).
- Open Innovation Hub (metadata homepage in `app/page.tsx`).

**Messaggi principali**

- Staff ibrido Human + AI Agents (`data/homepage.json` hero).
- Collaborazione quotidiana tra intelligenza umana e artificiale.
- «L'innovazione non è aggiungere tecnologia. È togliere complessità.» (`data/homepage.json`).
- «Non usiamo semplicemente l'Intelligenza Artificiale. Progettiamo Aziende Ibride.» (`data/site.json` `claimSecondary`).
- SEO: «l'innovazione deve amplificare il talento umano, non sostituirlo» (`data/seo-content.json`).

**Claim**

- `Powered by Human Intelligence. Amplified by AI.` (`data/site.json`; `docs/brand.md`).
- In hero UI, split tipografico: `POWERED BY HUMAN INTELLIGENCE.` (bianco) + `AMPLIFIED BY AI.` (fucsia) (`data/homepage.json` + `components/homepage/HomeHero.tsx`).

**Payoff / tagline**

- Footer: «Digital Innovation Company — Progettiamo Aziende Ibride.» (`data/site.json`).
- Footer homepage: «Digital Innovation Company. Progettiamo Aziende Ibride attraverso Intelligenza Artificiale, automazione e design.» (`data/homepage.json`).
- Subheadline hero: «L'intelligenza giusta per far crescere la tua azienda.»

**Concetti ricorrenti**

- Azienda Ibrida / Hybrid Companies
- Human Intelligence + Artificial Intelligence
- Lean.Agent / Lean.Agent.AI / Staff Ibrido
- Automazione, Digital Transformation
- Healthcare, Eventi, Comunicazione, Innovazione
- Lean Lab, Lean Academy, Suite LeanMe  
  (`docs/content.md`, `data/site.json`, `data/homepage.json`)

**Rapporto Human Intelligence / AI**

- Umano come base («Powered by Human Intelligence»), AI come amplificazione («Amplified by AI»).
- Agenti specializzati che operano in autonomia nel proprio ambito, coordinati e collegati al team umano (`data/homepage.json` `leanAgentAi.intro`).
- Chi siamo: «Persone e Agenti AI, insieme.» (`data/chi-siamo.json`).

**Differenza rispetto a una web agency tradizionale**

- Espresso in `docs/codex.md`: non è software house; combina AI + Human Intelligence + Automation + Design + Communication + Healthcare + business processes; il sito è «operating system» LeanMe, non mera vetrina.
- Sul sito: metodi, agenti AI nominati, Suite prodotti, percorsi verticali (sanità, società scientifiche, eventi), non portfolio agency generico.

**Nota homepage reale vs doc**

`docs/content.md` elenca sezioni storiche (Metodo, Case Studies, ecc.). La homepage implementata in `app/page.tsx` è: Hero → Lean.Agent.AI → Servizi → Lean Lab → Lean Academy → Testimonianze/Partner → (In poche parole) → Contact banner.

---

## 2. PALETTE COLORI

Definiti in `styles/globals.css` `@theme` (Tailwind CSS v4).  
`leanme-purple` è **alias** di `leanme-fuchsia` (`#e6007e`).

### Primario (brand accent)

| Nome funzionale | HEX | RGB (dove usato nel codice) | Uso |
|---|---|---|---|
| leanme-fuchsia | `#e6007e` | `rgb(230, 0, 126)` | CTA, titoli accent, underline, selection, glow, banner contatti base |
| leanme-fuchsia-dark | `#b80063` | `rgb(184, 0, 99)` | Hover CTA fucsia |
| leanme-fuchsia-light | `#ff1a8c` | `rgb(255, 26, 140)` | Gradienti banner / utility |

**HSL:** NON DEFINITO NEL PROGETTO.

### Secondari / accenti funzionali (homepage agenti e icone servizi)

Da `data/homepage.json` (`actionColor`) e `components/homepage/Icons.tsx`:

- Leonardo `#4DA3FF`
- Vespucci / eventi `#FF8A3D`
- Marconi / medical `#3DDBD9`
- Angela / science `#B06CFF`
- Galileo `#6BD66B`
- Olivetti `#FFD34D`
- Teresa / communication `#FF5FA2`

### Neutri brand

| Token | HEX | Uso tipico |
|---|---|---|
| leanme-black | `#000000` | Sfondo body, header, sezioni dark |
| leanme-white | `#ffffff` | Testo su dark, logo contrast, CTA invertita su banner |
| leanme-card | `#111111` | Card dark, highlight box |
| leanme-gray-50…900 | `#fafafa` … `#18181b` | Scala zinc-like; usata soprattutto su componenti light-legacy e testi gray |

**Sfondi aggiuntivi hardcoded**

- `#0a0a0a` — Teresa rail, alcune sezioni profilo (`TeresaPublicChat.tsx`, `ChiSiamoPersonProfile.tsx`)
- `#111111` / `#120810` / `#141018` — card e gradienti profilo

### Testi (sito dark dominante)

- Primario: `text-white`
- Secondario: `text-white/95`, `/85`, `/75`, `/70`, `/65`, `/60`, `/55`, `/45`, `/40`, `/35`
- Accent titoli/label: `text-leanme-fuchsia` / `text-leanme-purple` (stesso HEX)

### Bordi / divisori

- `border-white/[0.08]`, `border-white/10`, `border-white/15`, `white/20`, `white/70`
- Accent: `border-leanme-fuchsia/20`, `/25`, `/30`, `/40`, `/50`
- Light-legacy: `border-leanme-black/5`, `border-leanme-gray-200`

### Hover

- CTA: `hover:bg-leanme-fuchsia-dark` o `hover:bg-leanme-purple/90`
- Link fucsia → `hover:text-white`
- Nav dark: `hover:text-leanme-fuchsia`
- Social footer: `hover:border-leanme-fuchsia` + `hover:text-leanme-fuchsia`
- Card glow: ombra fucsia via Framer (`FuchsiaGlowCard.tsx`)

### Focus

- Pattern ricorrente: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia` (o `outline-white` su CTA secondaria hero)
- `Button.tsx` (legacy): `ring-2 ring-leanme-purple`

### Selection

- `::selection`: `bg-leanme-fuchsia/30 text-white` (`globals.css`)

### Gradienti reali nel codice

1. `.gradient-fuchsia`: `linear-gradient(135deg, #e6007e 0%, #b80063 100%)`
2. Contact banner `::before`: `#e6007e → #ff3d9a → #7a0044 → #ff60b0 → #e6007e` (animato, size 300%)
3. Contact shimmer: bianco trasparente `rgb(255 255 255 / 0.55)`
4. `.animate-contact-banner-bg`: `#e6007e / #c4006d / #e6007e / #ff1a8c`
5. Hero overlay: gradienti neri trasparenti left→right e bottom→top (`HomeHero.tsx`, `PageHero.tsx`)
6. Partner marquee edges: `from-black to-transparent`
7. Box «In poche parole»: `from-leanme-fuchsia/[0.08] to-black`
8. Profili team: `from-[#111111] via-[#141018] to-[#111111]`, `from-[#120810] via-[#111111] to-[#0a0a0a]`

### Ombre token

- `--shadow-card`: `0 24px 48px -12px rgb(0 0 0 / 0.12)`
- `--shadow-card-hover`: `0 32px 64px -16px rgb(230 0 126 / 0.18)`
- `--shadow-agent-glow`: `0 0 20px rgb(230 0 126 / 0.12)`
- Glow hover agent/card: fino a `rgba(230, 0, 126, 0.45)` (`FuchsiaGlowCard.tsx`)
- CTA glow keyframes: `rgb(230 0 126 / 0.45)` → `0.35`

### Combinazioni testo/sfondo consolidate

| Contesto | Sfondo | Testo |
|---|---|---|
| Body / sezioni dark | `#000000` | bianco / bianco opacità |
| CTA primaria | `#e6007e` | `#ffffff` |
| CTA primaria hover | `#b80063` | `#ffffff` |
| CTA secondaria hero | `black/25` + bordo `white/70` | bianco |
| CTA su banner fucsia | bianco | fucsia |
| Card dark | `#111111` | bianco + `white/55` body |
| Claim accent | nero/foto | fucsia |

**Nota:** esistono componenti light (`Card.tsx`, `Button.tsx` secondary/ghost, alcune `components/sections/*`) con sfondo bianco e testo nero/grigio: presenti nel repo ma **non** sono il look dominante della homepage/layout corrente (`body` = `bg-black text-white`).

---

## 3. TIPOGRAFIA

**Famiglia principale**  
Geist Sans — import `geist/font/sans` in `app/layout.tsx`; token `--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif` (`globals.css`).

**Font secondario**  
Geist Mono — `geist/font/mono`; `--font-mono: var(--font-geist-mono), ui-monospace, monospace`.  
Uso specifico mono nel marketing UI: **NON DEFINITO NEL PROGETTO** (variabile presente, uso non mappato in modo sistematico sulle pagine pubbliche analizzate).

**Fallback**  
`ui-sans-serif, system-ui, sans-serif` / `ui-monospace, monospace`.

**Pesi effettivamente usati**  
`font-medium`, `font-semibold`, `font-bold` (e default).  
Scale numeriche tipo 400/500/700 nominative: NON DEFINITO NEL PROGETTO oltre alle utility Tailwind.

### Dimensioni reali (homepage / layout dark)

| Ruolo | Classi tipiche | Mobile → Desktop |
|---|---|---|
| Claim hero | `text-[10px]` / `md:text-[11px]`, `uppercase`, `tracking-[0.2em]` | 10→11px |
| H1 hero | prefix `text-[1.75rem]` … `xl:text-5xl`; accent `text-[1.35rem]` … `xl:text-5xl`; `leading-[1.15]`, `font-bold` | scalato |
| H1 PageHero | `text-3xl md:text-4xl lg:text-5xl`, `tracking-[0.06em]`, `font-bold` | |
| H2 section (homepage) | `text-lg md:text-xl lg:text-2xl`, `font-bold`, `tracking-[0.14em]` (`SectionTitle`) | spesso UPPERCASE via contenuto JSON |
| H3 servizi | `text-xs lg:text-sm`, `font-bold`, `tracking-[0.04em]` | |
| Body hero | `text-sm` / `md:text-[15px]`; subheadline `text-base md:text-lg lg:text-xl` | |
| Body sezioni | `text-sm` / `md:text-base`, `leading-relaxed`, `text-white/65` | |
| Nav | `text-[10px] 2xl:text-[11px]`, `uppercase`, `tracking-[0.08em]`, `font-semibold` | |
| Label footer colonne | `text-[11px]`, `uppercase`, `tracking-[0.14em]` | |
| CTA tipiche | `text-[10px]`–`text-xs` / `md:text-xs`, `uppercase`, `tracking-[0.08em]`–`0.1em`, `font-semibold` | |
| Button.tsx (legacy) | `text-sm font-medium` | |

**Line-height**  
Ricorrenti: `leading-[1.15]` (H1 hero), `leading-snug`, `leading-relaxed`. Valori assoluti unificati: NON DEFINITO NEL PROGETTO.

**Letter-spacing**  
Pattern brand: `0.03em`–`0.06em` titoli; `0.08em`–`0.14em` label/CTA; claim `0.2em`.

**Maiuscole**  
Molto usate per nav, titoli sezione homepage, CTA, claim. Corpo testo in sentence case italiano.

**Antialiasing**  
`antialiased` su `body`.

---

## 4. LAYOUT E SPAZIATURE

**Larghezze massime**

- Shell header/footer/homepage: `max-w-[1440px]`
- `Container` / `PageSection` interno: `max-w-7xl` (80rem / 1280px Tailwind)
- Testi lunghi: spesso `max-w-3xl` / `max-w-xl` / `max-w-lg`

**Griglia**

- Header: `grid-cols-[auto_1fr_auto]`
- Footer: `md:grid-cols-2 lg:grid-cols-4`
- Agenti: `grid-cols-2 sm:3 md:4 xl:7`
- Servizi: `xl:grid-cols-5`; `md:2` / `lg:3` intermedi; lista mobile
- Testimonianze/partner: `lg:grid-cols-2`

**Padding orizzontale ricorrente**

- `px-5` → `md:px-10` → `lg:px-16` (o `lg:px-12` / `xl:px-16` in header/footer)
- Utility `.section-padding`: `px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24` (su homepage-flow il py verticale sezioni è azzerato)

**Spaziatura verticale homepage**

`.homepage-flow` gap: `2.5rem` → `md:3rem` → `lg:3.5rem` → `xl:4rem`  
Token: `--spacing-section: 6rem`; `--spacing-section-sm: 4rem` (definiti; uso utility dedicata: limitato / NON mappato ovunque).

**Gap componenti**  
Nav `xl:gap-2.5 2xl:gap-3.5`; card servizi `gap-4`/`gap-5`; agenti `gap-5 md:gap-6`.

**Border-radius**

- CTA / pill: `rounded-full`
- Card dark servizi/lab: `rounded-lg`
- Highlight / molte card: `rounded-xl`
- Card legacy / alcune sezioni: `rounded-2xl`
- Agent tile homepage: `rounded-sm` (`lib/agent-images.ts`)
- Teresa: `rounded-lg` / `rounded-md` / `rounded-full` badge

**Bordi**  
Sottili, spesso `border` + opacità bianco o fucsia (vedi palette). Underline titolo: barra `h-[2px] w-10` o `w-12` fucsia.

**Ombre**  
Token card + glow fucsia; `shadow-2xl` dropdown/mobile overlay; `shadow-lg` su Button primary legacy.

**Breakpoint (uso reale)**  
Media query esplicite in CSS: **768px**, **1024px**, **1280px**.  
Utility Tailwind usate: `sm`, `md`, `lg`, `xl`, `2xl`, `hover`, `focus-visible`.  
Valori default Tailwind v4 standard (non ridefiniti in `@theme`): tipicamente sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536 — **non c’è file `tailwind.config` che li sovrascriva**.

**Responsive nav**  
Desktop nav + CTA da `xl:`; sotto `xl` hamburger `MobileMenu`.

**Header altezza**  
`h-14` → `md:h-[60px]` → `xl:h-16`.

---

## 5. COMPONENTI VISIVI

### Header (`Header.tsx` + `ScrollHeader.tsx`)

- Sticky `z-50`, sfondo `bg-black/90 backdrop-blur-md` → scroll >80px: `bg-black/75 backdrop-blur-lg`
- Bordo inferiore `white/[0.08]` → `white/10`
- Logo pink-white `ASSETS.logo.pinkWhite`, altezza ~34–38px
- CTA: pill fucsia `px-5 py-2.5`, label uppercase 10px, hover dark

### Navigazione (`Navigation.tsx`)

- Dark: testo `white/85`, active/hover fucsia
- Dropdown: `rounded-xl border-white/10 bg-black shadow-2xl min-w-[20rem]`
- Icona Suite: griglia 3×3 cerchi (`SuiteAppsIcon.tsx`)

### Hero homepage (`HomeHero.tsx`)

- Full-bleed image `reception-render.png` + Ken Burns
- Overlay gradient nero da sinistra
- Claim + H1 bifase (bianco/fucsia) + sub + 2 paragrafi + 2 CTA (primaria glow, secondaria outline)

### Pulsanti

**Primari (pattern dominante sito dark)**  
`rounded-full bg-leanme-fuchsia text-white uppercase tracking ~0.08–0.1em text-[10px]–xs font-semibold px-6 py-3 hover:bg-leanme-fuchsia-dark` (+ spesso freccia).

**Secondari hero**  
`border-white/70 bg-black/25 text-white hover:border-white hover:bg-black/40`.

**Su banner fucsia** (`PercorsoConsultationCta` variant banner)  
`bg-white text-leanme-fuchsia hover:scale-105 hover:bg-white/90`.

**Button.tsx (componente riusabile legacy)**  
primary: purple/fuchsia + shadow; secondary: bianco/nero; ghost: testo nero → purple. Pensato per superfici chiare.

### Link

- Nav/footer: opacità bianco → bianco pieno o fucsia
- Link testo servizi: fucsia → bianco
- Legal: `hover:text-white/70`

### Card

- Dark servizi: `rounded-lg border-white/[0.08] bg-leanme-card` + glow hover
- Highlight: `rounded-xl border-leanme-fuchsia/20 bg-leanme-card p-6..10`
- LeanLab article: `rounded-lg border-white/[0.08] bg-leanme-card` + zoom media hover
- Legacy `Card.tsx`: bianco `rounded-2xl shadow-card`

### Badge

- `Badge.tsx`: `rounded-full bg-leanme-purple/10 text-leanme-purple text-xs`
- ServiceIconBadge: cerchio `border` colorato + `bg-black/40`

### Box informativi

- `InPocheParoleBox`: bordo fucsia/25 + gradient fucsia tenue → nero
- Contatti highlight: `border-leanme-fuchsia/30 bg-gradient-to-br from-leanme-fuchsia/10 to-black`

### CTA sezione contatti

- Full-width banner fucsia animato + shimmer + CTA bianca (`ContactBanner.tsx`)

### Form

- Teresa: input `border-white/15 bg-black rounded-lg`, focus bordo fucsia
- Contatti/newsletter: embed Jotform (`ContactFormEmbed`, `NewsletterFormEmbed`) — stile interno form: **NON DEFINITO NEL PROGETTO** (terza parte)

### Footer (`SiteFooter.tsx`)

- `bg-black`, bordo top `white/[0.08]`
- 4 colonne; logo più grande (~3.75–4.25rem h)
- Social: cerchi `h-9 w-9 border-white/20`
- Claim in fucsia in barra copyright

### Glass / blur / overlay

- Header: `backdrop-blur-md` / `lg`
- Overlay foto hero/page: gradienti neri trasparenti (non glass card generiche)
- LeanLab hover overlay fucsia `rgb(230 0 126 / 0.32)`

---

## 6. STILE DELLE IMMAGINI

**Soggetti ricorrenti (asset reali)**

- Reception/office render premium (`reception-render.png`) — legno, logo, monitor, luce calda (alt text espliciti)
- Ritratti Lean.Agent (Leonardo, Vespucci, Marconi, Angela, Galileo, Olivetti, Teresa) — tile verticali 384×960 e card 379×415
- Foto team umano (Luana, Alessandro)
- Fumetti storytelling Chi siamo
- Loghi partner (SYNLAB, ANISC, S.I.D., WSPH, AOP)
- Sfondo Lean Academy, banner ambient, pittogramma, logo ufficiale varianti

**Persone**  
Presenti: team umano; agenti come personaggi/avatar stilizzati; partner come loghi.  
NON DEFINITO NEL PROGETTO un brief fotografico formale oltre ad alt text e asset.

**Illuminazione / stile**  
Reception: illuminazione calda, ambiente premium (testi alt). Agenti: ritratto su fondo scuro tipico tile homepage (osservabile dagli asset path/trattamento script sharpen). Vignette percorsi: spesso `bg-white` (`PercorsoVignettes.tsx`).

**Composizione**  
Hero full-bleed + testo a sinistra; PageHero testo in basso a sinistra; agenti in griglia stretta verticale; comic a strip.

**Spazio negativo / bianco**  
Homepage dark: spazio nero, non “large white spaces” del brand doc su UI live. Il doc `docs/brand.md` cita large white spaces; **l’implementazione dominante è dark**. Bianco usato su vignette/fumetti e CTA invertite.

**Cromia**  
Dominante nero + fucsia; foto reception calde; accenti colore per agente/servizio.

**Tecnologia vs umano**  
Messaggio: collaborazione, non sostituzione. Visivamente: umani reali + agenti personificati + ambienti fisici LeanMe.

### Linee guida derivate (coerenti col sito, senza inventare asset)

**Coerenti:** reception LeanMe, staff, agenti ufficiali, fumetti brand, suite/prodotti, partner reali, claim Human+AI.

**Da evitare (per coerenza col sistema attuale):** stock generici purple-gradient SaaS; robot cliché; AI come sola chat bubble; layout “agency portfolio” chiaro se fuori contesto; immagini che contraddicono “amplifica l’umano”.

**Rappresentare AI:** Lean.Agent nominati, ruoli chiari, tile ufficiali.

**Human + AI:** persone + agenti affiancati / narrativa fumetto / claim bifase.

---

## 7. ICONOGRAFIA ED ELEMENTI GRAFICI

**Libreria**  
Nessuna libreria esterna (no Lucide/Heroicons package). SVG **custom inline** in `Icons.tsx`, `Icon.tsx`, `SocialIcon.tsx` (social ispirati a path Simple Icons, commento nel file), `SuiteAppsIcon.tsx`, `TeresaRailChevron.tsx`.

**Stile**  
Outline, `stroke="currentColor"`, `strokeWidth` tipici **1.25** (servizi) o **1.5** (arrow/chat/Icon); `strokeLinecap/Linejoin round`. Alcuni fill per quote/social.

**Dimensioni**  
Servizi icon `h-5–7 w-5–7` in badge `h-10–14`; arrow `h-4 w-4`; chat banner `h-8 w-8`; Suite `h-3.5 w-3.5`.

**Colori**  
`currentColor` + mappa per servizio (fucsia e accenti HEX sopra).

**Geometrie ricorrenti**  
Cerchi (badge, social, waffle 3×3, dots progress); pill CTA; underline rettangolo 2×40–48px fucsia; blur glow fucsia dietro card.

**Logo e pittogramma**

- Loghi: `logo-official.png`, `_white`, `_black`, `_pink-white` (`lib/assets.ts`)
- `pittogramma.png` in assets
- Suite icon: «Griglia 3×3 di cerchi — richiamo Microsoft 365 waffle + pittogramma LeanMe» (`SuiteAppsIcon.tsx`)

**Pattern**  
Marquee loghi partner; shimmer banner; nessun pattern texture CSS ripetuto oltre gradienti.

---

## 8. ANIMAZIONI E INTERAZIONI

**Stack**  
Framer Motion + CSS keyframes (`globals.css`).  
Rispetto `prefers-reduced-motion`: disabilita Ken Burns e CTA glow; allunga marquee/banner.

| Effetto | Dettaglio |
|---|---|
| Hero fade-up | opacity/y 36, duration 0.75, ease `[0.22, 1, 0.36, 1]`, stagger 0.14 |
| RevealOnScroll | opacity, y 64, scale 0.96→1, 0.65s stesso easing |
| FadeIn | y 16, 0.6s |
| SectionTitle underline | width 0→40, 0.55s |
| Ken Burns | scale 1→1.12, 9s ease-in-out alternate |
| CTA glow | box-shadow pulse 2.8s |
| Partner marquee | translateX -50%, 28–45s linear |
| Contact banner | gradient shift 5s; shimmer 3s |
| FuchsiaGlowCard | hover y -3/-4, scale ~1.01–1.015, blur glow 0.3s easeOut |
| LeanLab card | media scale 1.12 in 0.45s; overlay fucsia 0.35s |
| Header | transition bg/blur/border 300ms |
| Testimonial slide | 8s interval, opacity/translate 700ms |
| Banner CTA | `hover:scale-105` |

**Scroll**  
`html { scroll-behavior: smooth }` (auto se reduced motion).

**Da non replicare fuori contesto**  
Glow fucsia continuo su ogni CTA; Ken Burns su ogni foto; animazioni senza rispetto reduced-motion.

---

## 9. TONE OF VOICE RILEVATO

Da `docs/content.md` + testi JSON:

- **Tono:** professionale, elegante, innovativo, concreto, human.
- **Formalità:** medio-alta; italiano corretto; voi/tu implicito nei CTA («Connettiti», «Raccontaci»).
- **Frasi:** chiare, spesso brevi; claim in inglese; titoli sezione in MAIUSCOLO.
- **Tecnico:** AI, automazioni, FSE, abstract, gamification — spiegati in chiave beneficio.
- **Equilibrio:** umano prima, AI amplifica; anti-complessità («togliere complessità»).
- **Ricorrenti:** Azienda Ibrida, Staff Ibrido, Lean.Agent, Suite, Connettiti con noi, Come possiamo aiutarti.
- **CTA:** uppercase, verbali, dirette (CONNETTITI, SCOPRI, VAI ALLA…).
- **Da evitare (coerente con codex/brand):** tono software-house generica; AI come sostituto dell’umano; hype vuoto senza metodo.

---

## 10. REGOLE PER NEWSLETTER LEANME

*Traduzione fedele dello stile sito in HTML email (Brevo / client). Il progetto non contiene template newsletter HTML nativo: quanto segue è **mappatura** dal design system live.*

| Elemento | Specifica consigliata (derivata) |
|---|---|
| Larghezza | 600px (standard email; sito 1440 non applicabile) |
| Sfondo esterno | `#000000` |
| Contenitore | `#000000` o `#111111`, eventuale bordo `1px solid rgba(255,255,255,0.08)` |
| Header | logo `logo-official_pink-white.png`, altezza ~40–48px, padding 24–32px |
| Font | Geist non affidabile in email → fallback: `Arial, Helvetica, sans-serif` (Geist = NON garantito nei client) |
| Titoli | bianco `#FFFFFF`, bold, tracking ampio se uppercase; accenti `#E6007E` |
| Body | `#FFFFFF` ~85–75% → usare `#D4D4D8` / `#A1A1AA` se opacità non supportata |
| CTA | pill impossibile ovunque → `border-radius: 999px` dove supportato; bg `#E6007E`; testo `#FFFFFF`; padding ~12px 24px; hover non affidabile |
| Border-radius box | 8–12px (`rounded-lg`/`xl`) |
| Padding | 24–32px laterali; sezioni 24–40px verticali |
| Box | bg `#111111`, border fucsia 20–25% se supportato |
| Divisori | 1px `#27272A` / bianco 8%; o barra 2×48px `#E6007E` |
| Footer | copyright + claim fucsia; link legali grigi |
| Immagini | reception o asset ufficiali; hero email ~600×280–320; alt testuali |
| Responsive | stack colonne; CTA full-width su mobile |
| **Evitare** | CSS moderno complesso, backdrop-blur, Framer, gradienti animati, dark-mode-only senza fallback inline, purple generici non brand |

Struttura: **tabelle + CSS inline**.

---

## 11. REGOLE PER CONTENUTI SOCIAL E GRAFICHE

Derivato da palette/tipografia/immagini del sito:

- **Cover:** nero dominante, claim o titolo uppercase, accento fucsia, logo pink-white.
- **Titoli:** pochi, bold, tracking; claim inglese bifase bianco/fucsia quando è il messaggio.
- **Testo:** poco; una idea; eventuale sottotitolo breve.
- **Logo:** angolo o fascia superiore/inferiore, non invadente sul soggetto.
- **Colori:** fucsia `#E6007E`, nero, bianco; accenti agente solo se si parla di quell’agente.
- **Formati:** NON DEFINITO NEL PROGETTO (nessuna spec social nel repo) → usare standard piattaforma restando nei colori brand.
- **Foto:** reception, team, agenti ufficiali, fumetti; evitare stock AI robot.
- **Equilibrio:** sempre segnale Human + AI, mai solo tech.

---

## 12. REGOLE NON NEGOZIABILI

1. Sfondo UI pubblico dominante: **nero**; accento: **`#e6007e`**.
2. Claim: **Powered by Human Intelligence. Amplified by AI.**
3. Posizionamento: **Aziende Ibride / Digital Innovation Company**, non web agency generica.
4. AI = amplificazione dell’umano, non sostituzione.
5. Tipografia UI: **Geist Sans** (+ fallback system); CTA spesso **uppercase** + tracking ampio.
6. CTA primarie: pill **fucsia** testo bianco; hover `#b80063`.
7. Usare asset ufficiali (logo pink-white su dark, agenti, reception).
8. `leanme-purple` = stesso colore del fucsia: non introdurre un viola diverso.
9. Accessibilità: focus visibile; rispettare reduced-motion per animazioni forti.
10. Contenuti in **italiano** sul sito (claim inglese consentito).

### DA FARE

- Nero + bianco + fucsia LeanMe
- Claim e linguaggio Azienda Ibrida / Staff Ibrido / Lean.Agent
- CTA chiare uppercase pill
- Underline/accenti fucsia sottili
- Immagini ufficiali e personaggi agenti
- Glow/hover fucsia calibrato
- Layout aria dark, card `#111111`

### DA EVITARE

- Viola/indigo generici non `#e6007e`
- Template agency chiari come default del brand live
- Jotform/chat di terze parti come “voce” Teresa (ora nativa) nella narrazione brand
- Robot/AI cliché stock
- Messaggi “l’AI sostituisce le persone”
- Ombre multi-layer viola glow non brand
- Inventare colori/font non presenti in `globals.css` / layout

---

## 13. SPECIFICA COMPATTA PER AGENTI AI

```
LEANME_BRAND_DNA_vSITE
IDENTITY: Digital Innovation Company; Hybrid Companies (Aziende Ibride); not a web agency / not a pure software house. OS of LeanMe ecosystem.
CLAIM: "Powered by Human Intelligence. Amplified by AI." (UI often split: white + fuchsia "AMPLIFIED BY AI.")
SECONDARY: "Non usiamo semplicemente l'Intelligenza Artificiale. Progettiamo Aziende Ibride."
HUMAN+AI: human first; AI amplifies talent; Lean.Agent specialized teammates; Staff Ibrido Human+AI.
LANG: Italian site copy; English claim allowed. Tone: professional, elegant, innovative, concrete, human. Prefer clarity, anti-complexity ("togliere complessità").
PALETTE_PRIMARY: fuchsia #e6007e (alias leanme-purple); hover #b80063; light #ff1a8c; black #000000; white #ffffff; card #111111; rail/deep #0a0a0a.
NEUTRALS: gray-50 #fafafa … gray-900 #18181b (zinc scale).
TEXT_ON_DARK: white; muted white/95…/35; accent fuchsia.
BORDERS: white/8–20%; fuchsia/20–50%.
GRADIENTS_ALLOWED: 135deg #e6007e→#b80063; contact banner multi-stop fuchsia/pink/deep; hero black overlays; soft fuchsia/8→black panels. No generic purple-indigo SaaS gradients.
AGENT_ACCENTS_OPTIONAL: #4DA3FF #FF8A3D #3DDBD9 #B06CFF #6BD66B #FFD34D #FF5FA2 (named agents/services only).
TYPOGRAPHY: Geist Sans (--font-geist-sans) + ui-sans-serif,system-ui,sans-serif; Geist Mono available. Weights: medium/semibold/bold. Section titles often UPPERCASE tracking ~0.14em; nav/CTA uppercase tracking 0.08–0.1em; claim tracking ~0.2em. Hero H1 ~1.75rem→5xl bold leading 1.15; PageHero H1 3xl→5xl; body sm–lg leading-relaxed.
LAYOUT: max content 1440px shell / 1280px (max-w-7xl) pages; pad px-5 md:px-10 lg:px-16; dark sticky header blur; homepage section gap 2.5–4rem. Radius: pills full; cards lg/xl; agent tiles sm.
UI_COMPONENTS: primary CTA rounded-full bg#e6007e text white hover#b80063; secondary outline white/70 on dark; cards bg#111 border white/8; fuchsia underline 2px×40–48; glow hover rgba(230,0,126,~0.4). Header logo pink-white. Suite icon 3x3 dots.
MOTION: Framer ease [0.22,1,0.36,1]; soft fade/reveal; optional ken-burns/cta-glow/marquee; honor prefers-reduced-motion.
IMAGES: official reception (warm premium wood/light); official Lean.Agent portraits; human team; chi-siamo comics; partner logos. Represent AI as Lean.Agent characters + roles. Avoid stock robots, generic AI art, agency clutter.
CTA_LEXICON: CONNETTITI CON NOI; COME POSSIAMO AIUTARTI; SCOPRI…; VAI ALLA… — uppercase short.
NEWSLETTER_HTML: 600px; outer/inner #000/#111; logo pink-white; Arial/Helvetica fallback; titles #fff accent #e6007e; CTA #e6007e/#fff radius 999px; tables+inline CSS; no blur/animations; hero ~600x300 official art.
SOCIAL: black field, fuchsia accent, minimal uppercase type, official imagery, Human+AI message, logo restrained.
FORBIDDEN: invent colors/fonts; use non-brand purple; say AI replaces humans; generic template look; light-first as default brand surface for new LeanMe public content (site live is dark-first).
CHECK: claim present or coherent; #e6007e only brand accent; dark+fuchsia+white; Hybrid Company framing; Italian copy OK; assets official; CTA pill style; no forbidden clichés.
SOURCES: styles/globals.css; docs/brand.md; docs/content.md; docs/codex.md; data/site.json; data/homepage.json; app/layout.tsx; app/page.tsx; components/homepage/*; components/layout/*; lib/assets.ts.
```

---

### Percorsi file chiave

- Palette/token/animazioni: `styles/globals.css`
- Brand/content/codex: `docs/brand.md`, `docs/content.md`, `docs/codex.md`
- Claim e SEO: `data/site.json`, `data/homepage.json`, `data/seo-content.json`
- Font/layout shell: `app/layout.tsx`
- Homepage reale: `app/page.tsx` + `components/homepage/*`
- Header/footer/nav: `components/layout/Header.tsx`, `ScrollHeader.tsx`, `Navigation.tsx`, `SiteFooter.tsx`
- CTA/card/motion: `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `motion/*`
- Asset path: `lib/assets.ts`

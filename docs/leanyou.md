# LeanYou v1.0 — Area riservata clienti

LeanYou è l'area privata del sito LeanMe per clienti con servizi attivi. La **v1.0** include **Leonardo · Secretary Assistant** (verbali da audio/video).

## URL multi-tenant

Login unico pubblico: **`/leanyou/login`** — nessun branding cliente visibile dal menu del sito.

Dopo l'accesso (email, password o token), l'utente viene indirizzato all'area del proprio tenant:

| Cliente | Slug | Area Leonardo |
|---------|------|---------------|
| I&C srl | `iec` | `/leanyou/iec/leonardo` |

- Menu pubblico demo: voce **🔒 LEANYOU** → `/leanyou/login`
- Link legacy `/leanyou/iec/login` reindirizzano al login unico (token e query string preservati)
- Percorsi legacy `/leanyou/leonardo/*` reindirizzano al tenant della sessione attiva
- `robots.txt` esclude `/leanyou`

## Setup locale

1. Copia `.env.example` in `.env.local` e imposta:
   - `LEANYOU_SESSION_SECRET`
   - `OPENAI_API_KEY` (per generazione verbali)
2. Genera tenant, password hash e token:

```bash
npm run leanyou:access
```

3. Leggi il registro accessi in `.leanyou-data/access-registry.md`
4. Excel utenze attive: `.leanyou-data/utenze-attive.csv` (apribile con Excel)
5. Avvia il sito e accedi da `/leanyou/login`

## Accesso clienti

Due modalità:

- **Email + password** per singolo utente (scoped al tenant nell'URL)
- **Token URL** per accesso diretto (`/leanyou/login?token=...`)

Ogni azienda ha:

- un token aziendale (accede come admin di default)
- token individuali per ogni utente

### I&C srl (tenant `iec`)

Credenziali iniziali (vedi anche `access-registry.md` dopo `npm run leanyou:access`):

- Email: `info@iec-srl.it`
- Password: `iec-srl`
- Token: generato dallo script (link diretto nel registro)

## Storage

Dati runtime in `.leanyou-data/` (gitignored):

- `tenants.json` — utenze e token
- `workspaces/{tenantId}/*.json` — workspace verbali
- `access-registry.md` — registro credenziali generate

> Su Vercel il filesystem non è persistente: per produzione migrare a Postgres + Blob storage.

## Prompt Leonardo

I prompt sono in `data/leanyou/prompts.json`.

## Prossimi passi (post-v1)

- Coda job asincrona (Inngest) per riunioni lunghe
- Export DOCX nativo
- Storage persistente cloud

## Roadmap moduli tenant I&C srl (`iec`)

> **Nota:** strutture pianificate, non ancora in sviluppo. v1 include solo **Leonardo · Secretary Assistant**.

Moduli previsti nell'area personale I&C, visibili in sidebar LeanYou in base a tenant e utenza:

### 1. Leonardo · Secretary Assistant ✅ (v1)

Verbali da audio/video — già attivo.

### 2. Academy (LeanYou)

Video **a pagamento** esclusivi dell'area privata (distinti dai contenuti free dell'area pubblica `/lean-academy`).

- Acquisto a livello **azienda** o **singole utenze**
- Gestione accessi per utente/ruolo

### 3. Dashboard

Cruscotto riepilogativo tenant: KPI eventi, attività recenti, scorciatoie moduli attivi.

### 4. Eventi (gestionale congressi)

Gestione end-to-end degli eventi:

- Anagrafica eventi
- Logistica eventi
- Allotment
- Transfers
- Lettere di incarico
- Documenti relatori ECM
- Attestati di partecipazione
- Form di registrazione
- QR code / badge per accredito real time
- Form di ospitalità
- Survey
- Certificati di partecipazione
- Certificati ECM
- Budget evento: preventivo, consuntivo, versione cliente
- Registrazione fatture clienti e fornitori (bilancino evento)

### 5. Lean.Agent (contestuale evento)

Assistenza AI specifica per:

- Singolo evento
- Singolo partecipante

### 6. Database contatti

Anagrafica contatti collegata a ciascun evento, con ruolo per evento:

- Partecipanti
- Docenti
- Staff sponsor
- Staff tecnico
- Staff interno

### 7. Area documentale

Repository documenti tenant/evento con permessi per utenza.

---

**Menu sito pubblico (2026-07):** HOME · CHI SIAMO · COME POSSIAMO AIUTARTI · LEAN LAB · LEAN ACADEMY · DICONO DI NOI · 🔒 LEANYOU · CONNECT

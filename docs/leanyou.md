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
4. Excel credenziali (apribile con Excel):
   - **`.leanyou-data/utenze-credenziali.csv`** — Azienda, Nome, Cognome, Email, Password, URL accesso diretto
   - **`.leanyou-data/utenze-attive.csv`** — include anche Token e URL diretto
5. Avvia il sito e accedi da `/leanyou/login`

## Deploy Vercel (demo.leanme.it)

Su Vercel il file `.leanyou-data/tenants.json` **non esiste**. Carica i tenant via variabile d'ambiente:

1. In locale: `npm run leanyou:access`
2. Poi: `npm run leanyou:vercel-env` → copia il JSON stampato
3. Vercel → Project → Settings → Environment Variables:
   - `LEANYOU_TENANTS_JSON` = JSON minificato (Production)
   - `LEANYOU_SESSION_SECRET` = stringa random lunga
   - `OPENAI_API_KEY` = chiave OpenAI
   - `NEXT_PUBLIC_SITE_URL` = `https://demo.leanme.it`
4. Redeploy

Priorità caricamento tenant: `LEANYOU_TENANTS_JSON` → file locale → `tenants.example.json`

## Log accessi e attività

### Locale / server con filesystem

Per ogni tenant, file JSON Lines (una riga = un evento):

```
.leanyou-data/audit/{tenantId}/events.jsonl
```

Esempi tenant: `iec/events.jsonl`, `demo/events.jsonl`

Tentativi di login falliti senza tenant noto:

```
.leanyou-data/audit/_global/events.jsonl
```

Eventi registrati (v1):

- `login_success` / `login_failed` / `logout`
- `workspace_create` / `workspace_update` / `workspace_delete`
- `workspace_process_start` / `workspace_process_complete` / `workspace_process_failed`

Ogni riga contiene: timestamp ISO, tenant, utente, azione, IP (se disponibile), risorsa.

### Vercel (produzione)

I file audit **non persistono** su Vercel (filesystem effimero). Gli stessi eventi vengono scritti anche su **stdout** con prefisso `leanyou_audit`.

Consultabili in: **Vercel Dashboard → Project → Logs** → filtra per `leanyou_audit`.

> Per audit persistente in produzione: prossimo step Postgres / Log Drain / servizio esterno.

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
- `utenze-credenziali.csv` — Excel credenziali per azienda
- `utenze-attive.csv` — Excel completo con token
- `workspaces/{tenantId}/*.json` — workspace verbali
- `audit/{tenantId}/events.jsonl` — log accessi e attività
- `access-registry.md` — registro credenziali generate

> Su Vercel: usare `LEANYOU_TENANTS_JSON` per i tenant; workspace e audit file non persistono senza storage cloud.

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

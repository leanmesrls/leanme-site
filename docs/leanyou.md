# LeanYou v1.0 — Area riservata clienti

LeanYou è l'area privata del sito LeanMe per clienti con servizi attivi. La **v1.0** include **Leonardo · Secretary Assistant** (verbali da audio/video).

## URL multi-tenant

Ogni azienda cliente ha un percorso dedicato:

| Cliente | Slug | Login | Leonardo |
|---------|------|-------|----------|
| I&C srl | `iec` | `/leanyou/iec/login` | `/leanyou/iec/leonardo` |

- Menu pubblico demo: voce **LeanYou** → `/leanyou/iec/login`
- Percorsi legacy (`/leanyou`, `/leanyou/login`, `/leanyou/leonardo/*`) reindirizzano al tenant predefinito `iec` o alla sessione attiva
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
4. Avvia il sito e accedi da `/leanyou/iec/login`

## Accesso clienti

Due modalità:

- **Email + password** per singolo utente (scoped al tenant nell'URL)
- **Token URL** per accesso diretto (`/leanyou/{slug}/login?token=...`)

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

- Cruscotto tenant opzionale (attualmente solo Leonardo in sidebar)
- Coda job asincrona (Inngest) per riunioni lunghe
- Export DOCX nativo
- Integrazione gestionale eventi
- Storage persistente cloud

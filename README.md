# MyNews — Aggregatore Notizie Finanziarie e Geopolitiche

Webapp che aggrega notizie finanziarie e geopolitiche reali per supportare decisioni di portafoglio.

**Live**: [mynews.space](https://mynews.space)

## Funzionalita

- **Market Overview**: dati real-time su indici (S&P 500, NASDAQ, FTSE MIB, DAX, Nikkei), materie prime (oro, petrolio, argento), crypto (BTC, ETH), valute (EUR/USD, EUR/GBP)
- **Grafici interattivi**: click su qualsiasi asset per aprire un grafico storico con 5 periodi (1G, 1W, 1M, 3M, 1Y)
- **Top Notizie**: le notizie piu rilevanti del giorno con indicatore di impatto e fonte
- **Filtro per Categoria**: Mercati, Geopolitica, Banche Centrali, Earnings, Macro
- **Auto-refresh**: dati di mercato ogni 5 min, notizie ogni 30 min
- **Modalita Demo**: funziona anche senza API key con dati simulati

## Fonti Dati

| Fonte | Dati | Costo |
|-------|------|-------|
| Yahoo Finance | Indici, materie prime, valute | Gratuito (nessuna key) |
| CoinGecko | Criptovalute | Gratuito (nessuna key) |
| GNews.io | Notizie finanziarie e geopolitiche | Free tier (100 req/giorno) |

## Quick Start

```bash
# Installa le dipendenze
npm install

# Avvia in modalita sviluppo (funziona subito in modalita DEMO)
npm run dev

# Apri http://localhost:3000
```

## Configurazione API

Per notizie live, copia `.env.example` in `.env.local` e configura la key GNews:

```bash
cp .env.example .env.local
```

I dati di mercato funzionano senza API key (Yahoo Finance + CoinGecko).
Senza key GNews, le notizie usano dati demo simulati.

## Stack Tecnologico

- **Next.js 16** — App Router, API Routes, SSR
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling utility-first
- **SWR** — Data fetching con cache e auto-refresh
- **Recharts** — Grafici interattivi
- **Lucide React** — Icone

## Struttura Progetto

```
src/
  app/
    api/market/          # API route dati di mercato (Yahoo Finance)
    api/market/history/  # API route dati storici per grafici
    api/news/            # API route notizie (GNews.io)
    layout.tsx           # Root layout con metadata SEO
    page.tsx             # Entry point
    globals.css          # Stili globali e tema
  components/            # Componenti React
  hooks/                 # Custom hooks SWR
  lib/                   # Tipi, mock data, utility
backup/                  # Backup delle task completate
```

## Deploy

Il progetto e deployato su Vercel con auto-deploy dal branch `main`.

```bash
npm run build
npm start
```

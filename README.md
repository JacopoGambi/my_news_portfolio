# MyNews — Aggregatore Notizie Finanziarie e Geopolitiche

Webapp che aggrega notizie finanziarie e geopolitiche reali per supportare decisioni di portafoglio.

## Funzionalita

- **Market Overview**: dati real-time su indici (S&P 500, NASDAQ, FTSE MIB, DAX, Nikkei), materie prime (oro, petrolio), crypto (BTC, ETH), valute (EUR/USD, EUR/GBP)
- **Top Notizie**: le notizie piu rilevanti del giorno con indicatore di impatto e fonte
- **Filtro per Categoria**: Mercati, Geopolitica, Banche Centrali, Earnings, Macro
- **Calendario Economico**: prossimi eventi rilevanti (riunioni FED/BCE, report trimestrali)
- **Dark/Light Mode**: toggle con persistenza in localStorage
- **Auto-refresh**: dati di mercato ogni 5 min, notizie ogni 30 min
- **Modalita Demo**: funziona anche senza API key con dati simulati

## Quick Start

```bash
# Installa le dipendenze
npm install

# Avvia in modalita sviluppo (funziona subito in modalita DEMO)
npm run dev

# Apri http://localhost:3000
```

## Configurazione API (opzionale)

Per dati reali, copia `.env.example` in `.env.local` e configura le API key:

```bash
cp .env.example .env.local
```

### API Key necessarie

| API | Scopo | Registrazione | Costo |
|-----|-------|--------------|-------|
| NewsAPI.org | Notizie finanziarie | https://newsapi.org/register | Free tier disponibile |
| Alpha Vantage | Dati indici/azioni | https://www.alphavantage.co/support/#api-key | Free (5 req/min) |
| Finnhub | Notizie + calendario | https://finnhub.io/register | Free tier disponibile |
| ExchangeRate API | Tassi di cambio | https://www.exchangerate-api.com/ | Free (1500 req/mese) |
| CoinGecko | Dati crypto | Nessuna registrazione | Free (no key necessaria) |

Senza API key configurate, l'app funziona in **modalita DEMO** con dati realistici simulati, chiaramente etichettati.

## Stack Tecnologico

- **Next.js 16** — App Router, API Routes, SSR
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling utility-first
- **SWR** — Data fetching con cache e auto-refresh
- **next-themes** — Dark/Light mode
- **Lucide React** — Icone

## Struttura Progetto

```
src/
  app/
    api/market/     # API route per dati di mercato
    api/news/       # API route per notizie
    api/calendar/   # API route per calendario economico
    layout.tsx      # Root layout con metadata SEO
    page.tsx        # Entry point
    globals.css     # Stili globali e tema
  components/       # Componenti React
  hooks/            # Custom hooks SWR
  lib/              # Tipi, mock data, utility
docs/progetto/      # Documenti di progetto
backup/             # Backup delle task completate
```

## Build Produzione

```bash
npm run build
npm start
```

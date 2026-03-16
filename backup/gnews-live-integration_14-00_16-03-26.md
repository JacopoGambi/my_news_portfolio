# Integrazione GNews API - Notizie Live

**Data:** 16 marzo 2026, 14:00

## Cosa è stato fatto

### 1. Integrazione GNews.io per notizie in tempo reale
- Sostituito il sistema di mock news statiche con chiamate live a GNews.io
- Due endpoint utilizzati:
  - `search` con query finanziarie (borsa, mercati, economia, banche, petrolio, oro, bitcoin, inflazione) → notizie di mercato
  - `top-headlines?category=world` → notizie geopolitiche
- Cache in-memory di 30 minuti per restare nei limiti del piano free (100 req/giorno)
- Fallback a mock data se l'API fallisce

### 2. Auto-categorizzazione articoli
- Ogni articolo viene categorizzato automaticamente tramite keyword matching:
  - **Banche Centrali**: fed, bce, ecb, tassi, monetaria, powell, lagarde...
  - **Earnings**: earning, trimestrale, ricavi, profitti, bilancio, fatturato...
  - **Geopolitica**: guerra, sanzioni, dazi, iran, russia, trump, missile, soldati, raid, teheran, gaza, hamas, hezbollah, attacco...
  - **Macro**: pil, gdp, inflazione, cpi, pmi, disoccupazione, istat...
  - **Mercati**: tutto il resto
- Impatto stimato (alto/medio/basso) basato su keywords nel titolo
- Filtro per escludere articoli non rilevanti (cucina, gossip, sport, meteo...)

### 3. Fix Footer
- Aggiornate le fonti dati nel footer: ora mostra Yahoo Finance, CoinGecko, e "notizie curate da fonti italiane e internazionali"
- Rimosse le fonti non più utilizzate (Alpha Vantage, NewsAPI, Finnhub)

### 4. Aggiornato .env.example
- Rimossi NEWSAPI_KEY e FINNHUB_KEY
- Aggiunto GNEWS_KEY

## Configurazione necessaria
- API key GNews in `.env.local` e su Vercel: `GNEWS_KEY=5bbb7cbf14366e965272bc434f7ea440`
- Piano free: 100 req/giorno, 10 articoli/req, 12h delay

## Stato attuale dei dati
| Sezione | Fonte | Stato |
|---------|-------|-------|
| Market Overview | Yahoo Finance + CoinGecko | Live |
| Notizie | GNews.io | Live |
| Calendario Economico | Mock data | Statico |

## File modificati
- `src/app/api/news/route.ts` — riscritto per GNews
- `src/components/Footer.tsx` — fonti aggiornate
- `.env.example` — nuova config
- `.env.local` — API key GNews (non committato)

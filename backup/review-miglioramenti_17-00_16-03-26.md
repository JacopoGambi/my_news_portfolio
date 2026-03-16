# Review Generale e Miglioramenti

**Data:** 16 marzo 2026, ~17:00

## Cosa è stato fatto

### 1. Integrazione GNews.io — Notizie Live
- Sostituito sistema di mock news statiche con chiamate live a GNews.io
- Due endpoint: `search` (query finanziarie) + `top-headlines?category=world` (geopolitica)
- Cache in-memory 30 minuti per rispettare limiti piano free (100 req/giorno)
- Fallback a mock data se API fallisce
- API key configurata su Vercel: `GNEWS_KEY`

### 2. Auto-categorizzazione articoli
- Categorie: Banche Centrali, Earnings, Mercati, Geopolitica, Macro
- Priorità titolo per segnali di mercato (prezzi, barile, borsa) PRIMA di geopolitica
- Fix: "Petrolio a 105 dollari" ora classificato come Mercati (non Geopolitica)
- Fix: articoli su soldati/raid/attacchi ora classificati correttamente come Geopolitica
- Stima impatto (high/medium/low) basata su keywords nel titolo
- Filtro articoli irrilevanti (cucina, gossip, sport, meteo)

### 3. Descrizioni notizie migliorate
- Implementata selezione smart tra `description` e `content` di GNews
- Filtro testo spazzatura: cookie banner, paywall, descrizioni generiche giornali
- Priorità: content pulito > description pulita > fallback
- Funzione `cleanText()` per rimuovere troncamenti e CTA

### 4. Rinominato "MyNews" → "My News"
- Header: titolo e sottotitolo
- Footer: copyright e descrizione
- Layout: metadata title e OpenGraph

### 5. Header — Favicon al posto dell'icona Activity
- Rimossa icona `Activity` di lucide-react
- Sostituita con `<Image src="/favicon.ico">` da next/image

### 6. Footer — Fonti dati aggiornate
- Rimossi: Alpha Vantage, NewsAPI, Finnhub, Reuters, Bloomberg
- Aggiunti: Yahoo Finance, CoinGecko, notizie curate italiane/internazionali

### 7. Env aggiornato
- `.env.example`: rimossi NEWSAPI_KEY e FINNHUB_KEY, aggiunto GNEWS_KEY
- `.env.local`: configurato con API key GNews

## File modificati
- `src/app/api/news/route.ts` — riscritto per GNews con categorizzazione e filtri
- `src/components/Header.tsx` — favicon + rename "My News"
- `src/components/Footer.tsx` — fonti aggiornate + rename
- `src/app/layout.tsx` — metadata rename
- `.env.example` — nuova config

## Stato attuale dei dati
| Sezione | Fonte | Stato |
|---------|-------|-------|
| Market Overview | Yahoo Finance + CoinGecko | Live |
| Notizie | GNews.io | Live |
| Calendario Economico | Mock data | Statico |

## Note
- Piano GNews free: 100 req/giorno, 10 articoli/req, ~12h delay sulle notizie
- Cache server-side 30 min + SWR client-side 30 min
- Tutte le modifiche pushate su GitHub → deploy automatico Vercel

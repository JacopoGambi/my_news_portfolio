# Backup: Deploy su Vercel — Configurazione Completa

## Data: 16/03/2026 - 12:10

## Stato: ✅ Live su https://mynewsportfolio.vercel.app/

## Riepilogo Sessione

### 1. Fix Theme Toggle
- Il pulsante dark/light mode non funzionava — le variabili CSS in `@theme inline` (Tailwind 4) avevano specificità troppo alta per essere sovrascritte da `.light`
- Fix: cambiato selettore a `html.light` per specificità superiore
- Successivamente rimosso completamente il toggle e il light mode su richiesta utente
- Rimossi: `ThemeToggle.tsx`, `ThemeProvider.tsx`, dipendenza `next-themes`

### 2. Fix Bordi Bianchi in Dark Mode
- Ridotta opacità dei bordi colorati nelle card: `/20` → `/10`, `/40` → `/25`
- File modificati: `MarketCard.tsx`, `NewsCard.tsx`, `Header.tsx`

### 3. Argento + Grafici Market Card
- Aggiunta card **Argento (SI=F)** alle materie prime
- Tutte le market card rese **cliccabili** con modale grafico
- Creato `MarketChartModal.tsx` con **recharts**: AreaChart con gradient, 5 periodi (1G/1S/1M/3M/1A), tooltip, colori dinamici
- Creata API `/api/market/history` per dati storici
- Variazione % e assoluta nell'header della modale si aggiornano in base al periodo selezionato
- Dipendenza aggiunta: `recharts`

### 4. Dati di Mercato Reali — Yahoo Finance
- Migrazione completa da mock/multi-API a **yahoo-finance2** come fonte unica
- Nessuna API key necessaria
- 12 asset coperti: 5 indici, 3 materie prime, 2 crypto, 2 valute
- Simboli Yahoo: `^GSPC`, `^IXIC`, `FTSEMIB.MI`, `^GDAXI`, `^N225`, `GC=F`, `CL=F`, `SI=F`, `BTC-USD`, `ETH-USD`, `EURUSD=X`, `EURGBP=X`
- Dati storici nei grafici anch'essi reali da Yahoo Finance
- Fallback automatico ai mock se Yahoo Finance non risponde
- Rimosse dipendenze API: Alpha Vantage, ExchangeRate, CoinGecko

### 5. News — Dati Editoriali Curati
- Le API news gratuite (NewsAPI, Finnhub) non funzionano bene in produzione:
  - NewsAPI piano gratuito funziona solo da localhost
  - Finnhub restituisce notizie generiche in inglese con immagini di bassa qualità
- Decisione: usare i **dati mock curati in italiano** con immagini Unsplash di qualità
- Le API key (NEWSAPI_KEY, FINNHUB_KEY) sono configurate su Vercel ma non utilizzate al momento

### 6. Deploy su Vercel
- Repository GitHub: `JacopoGambi/my_news_portfolio` (rinominato da `MyNews`)
- Progetto Vercel: **mynewsportfolio**
- URL: https://mynewsportfolio.vercel.app/
- Env vars configurate su Vercel: `NEWSAPI_KEY`, `FINNHUB_KEY` (non attive al momento)
- Deploy automatico da branch `main` via git push

## Architettura Dati Attuale
| Sezione | Fonte | Stato |
|---------|-------|-------|
| Market Overview (card) | Yahoo Finance (live) | ✅ Tempo reale |
| Grafici andamento | Yahoo Finance (live) | ✅ Tempo reale |
| News | Mock editoriali (italiano) | ⚠️ Statiche |
| Calendario Economico | Mock | ⚠️ Statico |

## File Modificati in Questa Sessione
- `src/app/globals.css` — rimosso light theme
- `src/app/layout.tsx` — rimosso ThemeProvider, classe `dark` fissa
- `src/app/api/market/route.ts` — riscritto con yahoo-finance2
- `src/app/api/market/history/route.ts` — riscritto con yahoo-finance2
- `src/app/api/news/route.ts` — semplificato a mock data
- `src/components/MarketCard.tsx` — cliccabile + modale grafico
- `src/components/MarketChartModal.tsx` — NUOVO
- `src/components/MarketOverview.tsx` — skeleton count aggiornato
- `src/components/NewsCard.tsx` — opacità bordi ridotta
- `src/components/Header.tsx` — rimosso ThemeToggle
- `src/lib/mockData.ts` — aggiunto Argento, prezzi aggiornati
- `.env.example` — semplificato
- Rimossi: `ThemeToggle.tsx`, `ThemeProvider.tsx`
- Dipendenze aggiunte: `recharts`, `yahoo-finance2`
- Dipendenze rimosse: `next-themes`

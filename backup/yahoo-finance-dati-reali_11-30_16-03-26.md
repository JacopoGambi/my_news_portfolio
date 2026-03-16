# Backup: Yahoo Finance — Dati di Mercato Reali

## Data: 16/03/2026 - 11:30

## Task completata
Migrazione completa dei dati di mercato da mock/multi-API a Yahoo Finance come fonte unica e attendibile.

## Modifiche effettuate
1. `src/app/api/market/route.ts` — riscritto completamente: usa yahoo-finance2 per tutti i 12 asset (indici, materie prime, crypto, forex). Fallback ai mock solo se Yahoo Finance non risponde.
2. `src/app/api/market/history/route.ts` — riscritto: usa yahoo-finance2 chart() per dati storici reali con intervalli corretti per ogni periodo.
3. `.env.example` — rimossi ALPHA_VANTAGE_KEY, EXCHANGERATE_KEY, CoinGecko (non più necessari). Yahoo Finance non richiede API key.
4. `src/lib/mockData.ts` — prezzi mock aggiornati ai valori reali del 16/03/2026

## Dipendenze
- Aggiunta: `yahoo-finance2` — dati finanziari da Yahoo Finance (no API key)
- Rimossa: `next-themes` (task precedente)
- Rimosse da .env: ALPHA_VANTAGE_KEY, EXCHANGERATE_KEY

## Fonte dati
Yahoo Finance via yahoo-finance2: indici (^GSPC, ^IXIC, FTSEMIB.MI, ^GDAXI, ^N225), commodity (GC=F, CL=F, SI=F), crypto (BTC-USD, ETH-USD), forex (EURUSD=X, EURGBP=X)

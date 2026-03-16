# Backup: Argento + Grafici Market Card

## Data: 16/03/2026 - 11:00

## Task completata
Aggiunta card Argento alle market card e reso tutte le card cliccabili con modale grafico di andamento.

## Modifiche effettuate
1. `src/lib/mockData.ts` — aggiunto Argento (SI=F) ai mock market data
2. `src/app/api/market/route.ts` — aggiunto SI=F ai simboli Alpha Vantage
3. `src/app/api/market/history/route.ts` — NUOVO: API endpoint per dati storici con mock generator per periodi 1G/1S/1M/3M/1A
4. `src/components/MarketChartModal.tsx` — NUOVO: modale con grafico AreaChart (recharts), selettore periodo, tooltip custom, gradient fill, colori dinamici positivo/negativo
5. `src/components/MarketCard.tsx` — reso cliccabile (cursor-pointer + onClick), apre MarketChartModal
6. `src/components/MarketOverview.tsx` — aggiornato skeleton count da 11 a 12

## Dipendenze aggiunte
- `recharts` — libreria grafici React

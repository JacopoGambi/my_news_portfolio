# Fix: Rimozione Calendario Demo e Etichetta DEMO

**Data**: 16 Marzo 2026, 18:30
**Tipo**: Bug fix / Cleanup

## Contesto

Controllo generale del sito mynews.space ha rivelato 3 problemi:
1. Calendario economico con dati demo (`isDemo: true`) mentre news e market sono live
2. Evento BoJ senza forecast/previous nel calendario
3. Etichetta "DEMO" visibile in homepage durante il caricamento iniziale (default `true` nei hook)

## Modifiche Effettuate

### 1. Rimozione completa Calendario Economico
Il calendario usava dati mock statici. Renderlo live richiederebbe Finnhub API a pagamento.

**File rimossi:**
- `src/components/EconomicCalendar.tsx`
- `src/hooks/useCalendar.ts`
- `src/app/api/calendar/route.ts`

**File modificati:**
- `src/components/Dashboard.tsx` — rimosso import e rendering di EconomicCalendar
- `src/components/SkeletonCard.tsx` — rimosso `SkeletonCalendarRow`
- `src/lib/mockData.ts` — rimosso `mockCalendar` array e import `CalendarEvent`
- `src/lib/types.ts` — rimossa interfaccia `CalendarEvent`

### 2. Fix Etichetta DEMO
- `src/hooks/useMarketData.ts` — default `isDemo` cambiato da `true` a `false`
- `src/hooks/useNews.ts` — default `isDemo` cambiato da `true` a `false`

Ora l'etichetta DEMO appare solo se le API restituiscono effettivamente `isDemo: true`.

## Stato Attuale
- **Market**: Yahoo Finance (live)
- **News**: GNews (live)
- **Calendario**: RIMOSSO
- **Etichetta DEMO**: non visibile (dati live)

## Build
Build completato con successo, nessun errore TypeScript.

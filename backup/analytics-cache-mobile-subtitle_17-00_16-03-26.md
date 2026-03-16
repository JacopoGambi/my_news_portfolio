# Analytics, Cache 6h, Sottotitolo Mobile

**Data:** 16 marzo 2026, 17:00

## Cosa è stato fatto

### 1. Vercel Analytics
- Installato `@vercel/analytics`
- Aggiunto componente `<Analytics />` nel root layout (`src/app/layout.tsx`)
- Import da `@vercel/analytics/next` (specifico per Next.js)

### 2. Cache notizie portata a 6 ore
- Modificato `CACHE_TTL` in `src/app/api/news/route.ts` da 30 minuti a 6 ore
- Motivazione: le notizie GNews (piano free) hanno già ~12h di delay, non serve aggiornare ogni 30 minuti

### 3. Sottotitolo visibile su mobile
- Rimosso `hidden sm:block` dal sottotitolo "by Jacopo Gambi — Decisioni informate, ogni giorno" in `src/components/Header.tsx`
- Ora visibile su tutti i dispositivi

### 4. Filtro notizie spettacolo/entertainment
- Ampliato il regex `irrelevant` nella funzione `isRelevant()` in `src/app/api/news/route.ts`
- Aggiunte keyword: oscar, film, cinema, attore/attrice, regista, hollywood, musica, concerto, cantante, celebrity, spettacolo, entertainment, ecc.

## File modificati
- `src/app/layout.tsx` — Vercel Analytics
- `src/app/api/news/route.ts` — cache 6h + filtro entertainment
- `src/components/Header.tsx` — sottotitolo mobile
- `package.json` / `package-lock.json` — dipendenza @vercel/analytics

# Backup: Redesign Notizie — Layout Giornalistico

## Data: 16/03/2026 - 10:23

## Task completata
Redesign completo del layout notizie da card compatte a stile giornalistico.

## Modifiche effettuate
1. `src/lib/types.ts` — aggiunto campo opzionale `imageUrl` a `NewsItem`
2. `src/lib/mockData.ts` — descrizioni piu lunghe e dettagliate stile giornalistico, aggiunte immagini Unsplash
3. `src/components/NewsCard.tsx` — riscritto completamente:
   - Layout "hero" per la prima notizia: immagine grande, titolo 2xl/3xl, descrizione completa
   - Layout standard: orizzontale con testo a sinistra e immagine a destra
   - Barra laterale colorata per impatto (rosso/giallo/verde)
   - Icone per categoria
   - Data formattata + "X ore fa"
4. `src/components/TopNews.tsx` — layout verticale con separatori, prima notizia come hero
5. `src/components/NewsByCategory.tsx` — layout verticale con separatori
6. `src/components/SkeletonCard.tsx` — skeleton aggiornato per il nuovo layout
7. `src/app/api/news/route.ts` — mappato `urlToImage` (NewsAPI) e `image` (Finnhub) + descrizioni piu lunghe (300 char)
8. `next.config.ts` — abilitati domini immagini remote

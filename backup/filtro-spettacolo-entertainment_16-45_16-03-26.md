# Filtro Notizie Spettacolo/Entertainment

**Data:** 16 marzo 2026, 16:45

## Problema
Notizie di spettacolo/intrattenimento (es. Oscar 2026, cinema) passavano il filtro di rilevanza e apparivano nella sezione Mercati del sito. Esempio: "Vincitori Oscar 2026" categorizzato come "Mercati" con fonte Vogue Italia.

## Soluzione
Ampliato il regex nella funzione `isRelevant()` in `src/app/api/news/route.ts` aggiungendo keyword per:
- **Cinema**: oscar, academy award, film, cinema, attore/attrice, regista, regia, red carpet, hollywood, box office, nomination, cannes, venezia mostra, festival del cinema
- **Musica**: concerto, musica, cantante, album, singolo, tour, rapper, pop star, talent show
- **Generico entertainment**: celebrity, spettacolo, intrattenimento, entertainment, show business, golden globe

## File modificati
- `src/app/api/news/route.ts` — regex `irrelevant` in `isRelevant()` ampliato

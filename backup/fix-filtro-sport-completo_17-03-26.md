# Fix Filtro Sport Completo

**Data:** 17 marzo 2026

## Problema
Notizie sportive (es. Serie A) passavano il filtro `isRelevant()` perche il regex conteneva solo "calcio", "sport" e "serie tv", ma non "serie a" ne molte altre keyword sportive comuni.

## Soluzione
Ampliato massicciamente il regex `irrelevant` in `isRelevant()` in `src/app/api/news/route.ts` aggiungendo:
- **Calcio italiano**: serie a/b/c, campionato, partita, gol, classifica, scudetto, calciomercato, derby, formazione, tabellino, ecc.
- **Ruoli/arbitraggio**: allenatore, arbitro, rigore, espulsione, cartellino, attaccante, difensore, portiere
- **Tutte le squadre Serie A**: Juventus, Inter, Milan, Napoli, Roma, Lazio, Fiorentina, Atalanta, ecc.
- **Competizioni europee**: Champions League, Europa League, Conference League, Coppa Italia
- **Tifoseria**: stadio, tifosi, ultras, curva
- **Motorsport**: Formula 1, MotoGP, gran premio, pole position, podio
- **Altri sport**: tennis (Slam), NBA, rugby, pallavolo, nuoto, atletica
- **Grandi eventi**: Olimpiadi, Europei, Mondiali, Coppa del Mondo

## File modificati
- `src/app/api/news/route.ts` — regex `irrelevant` in `isRelevant()` ampliato con ~70 nuove keyword sportive

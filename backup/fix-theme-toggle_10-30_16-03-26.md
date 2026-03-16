# Backup: Fix Theme Toggle (Dark/Light Mode)

## Data: 16/03/2026 - 10:30

## Task completata
Il bottone toggle tema (dark/light mode) in alto a destra non funzionava — rimaneva sempre in dark mode.

## Problema
In `globals.css`, il blocco `@theme inline` di Tailwind CSS 4 definiva le variabili colore dark con valori concreti. Queste generavano CSS su `:root` con alta specificità, impedendo al selettore `.light` di sovrascriverle quando `next-themes` applicava la classe sull'`<html>`.

## Fix applicato
- `src/app/globals.css` — mantenuti i valori dark originali in `@theme inline` (genera `:root`), cambiato il selettore light da `.light` a `html.light` per avere specificità (0,2,0) superiore a `:root` (0,1,0) e sovrascrivere correttamente le variabili

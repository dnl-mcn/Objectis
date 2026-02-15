# Objectis Framework: Inizializzazione (v0.0.11)

Questo è il file principale da includere per attivare il framework. Coordina l'interazione tra i vari moduli (Ajax, Events, DomScanner, ecc.).

## Flusso di Avvio

1. **Aggancio Eventi:** Viene invocato `setEvents` per monitorare resize e scroll.
2. **Scansione DOM:** Viene eseguito `scanDocument` per attivare i componenti `obj-*`.
3. **Debug Report:** Se `const_B_DEBUG` è attivo, vengono stampate le statistiche iniziali nell'area di log.

## Ordine di Inclusione consigliato

Per garantire che tutte le dipendenze siano caricate, seguire questo ordine nel tag `<head>` o prima della chiusura del `</body>`:

1. `Core.js`
2. `TypeCheck.js`
3. `Events.js`
4. ... altri moduli ...
5. `Objectis.js` (Sempre per ultimo)

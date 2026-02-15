# Objectis DomScanner (v0.0.7)

Il `DomScanner` è il motore di attivazione automatica della libreria. Permette di trasformare elementi statici in componenti dinamici senza scrivere codice aggiuntivo nell'HTML.

## Metodi Disponibili

### Objectis.scanDocument(O_ROOT)

Esegue una scansione ricorsiva di tutti i tag `<div>`. Se un elemento possiede una classe con prefisso `obj-`, viene preparato per l'inizializzazione.

- **Parametri:** `O_ROOT` (Object, opzionale). Se omesso, scansiona l'intero `document`.
- **Performance:** In IE6 la scansione è ottimizzata per minimizzare il reflow.

## Convenzione Naming Classi

Per essere rilevato, un elemento deve seguire questo standard:
`<div class="obj-button"></div>`
`<div class="obj-slider"></div>`

## Esempio d'uso

```javascript
// Da invocare al window.onload
Objectis.scanDocument();
```

# Objectis DomQuery (v0.0.4)

Modulo per l'interazione con il DOM. Fornisce metodi di selezione sicuri che normalizzano le mancanze dei browser legacy (come IE6).

## Metodi Disponibili

### Objectis.getElement(S_ID)

Cerca un elemento tramite il suo ID univoco.

- **Parametri:** `S_ID` (String).
- **Ritorna:** L'oggetto DOM o `null`.
- **Note:** Se il flag `const_B_DEBUG` è attivo, segnala l'assenza dell'elemento nell'HTML.

### Objectis.getElementsByClass(S_CLASS, O_PARENT)

Cerca tutti gli elementi che contengono la classe specificata.

- **Parametri:** `S_CLASS` (String), `O_PARENT` (Object, opzionale).
- **Ritorna:** Un Array (non una HTMLCollection viva) di elementi.
- **Compatibilità:** Implementa una scansione manuale `O(n)` per sopperire alla mancanza di `getElementsByClassName`.

## Esempio d'uso

```javascript
// Cattura un div specifico
var var_o_main = Objectis.getElement("main-container");

// Cattura tutti i componenti slider nel documento
var var_a_sliders = Objectis.getElementsByClass("obj-slider");
```

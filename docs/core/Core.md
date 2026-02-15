# Objectis Core (v0.0.2)

Il file `Core.js` è il punto di ingresso della libreria. Definisce il namespace globale e inizializza i sistemi di monitoraggio necessari per il debug in ambienti legacy.

## Funzioni Principali

### 1. Objectis.logError
Intercetta un messaggio di errore e lo stampa in un elemento `<pre>` creato dinamicamente nel `body`.

**Esempio d'uso:**
```javascript
if (typeof S_PARAM !== "string") {
    Objectis.logError("Parametro non valido in funzione X");
}
```
### 2.Objectis.trackCall
Incrementa il contatore globale delle chiamate. Utile per identificare loop infiniti o sovraccarichi in IE6.

**Esempio d'uso:**
```javascript
Objectis.trackCall("miaFunzione");
```

## Variabili di Configurazione

Il Core gestisce lo stato globale della libreria tramite variabili e costanti prefissate. Queste impostazioni influenzano il comportamento di tutti i moduli successivi.

| Variabile | Tipo | Descrizione |
| :--- | :--- | :--- |
| `const_B_DEBUG` | Boolean | Se impostata su `true`, abilita il sistema di logging HTML e le statistiche in tempo reale. |
| `var_o_stats` | Object | Oggetto strutturato che memorizza il conteggio totale (`var_n_totalCalls`) e i dati per singolo modulo. |

### Esempio di Inizializzazione
```javascript
// Attivazione modalità Debug per lo sviluppo
var const_B_DEBUG = true;

// Inizializzazione registro statistiche
var var_o_stats = {
    var_n_totalCalls: 0,
    var_o_moduleCalls: {}
};
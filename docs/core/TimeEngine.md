# Objectis TimeEngine (v0.0.5)

Il modulo `TimeEngine` normalizza la gestione temporale all'interno del framework, fornendo strumenti per il calcolo di intervalli e la formattazione dei dati cronometrici.

## Metodi Disponibili

### Objectis.getTimestamp()

Ritorna il numero di millisecondi trascorsi dal 1 gennaio 1970. Utilizzato per calcolare la durata delle operazioni o per generare ID temporali univoci.

### Objectis.formatTime(N_SECONDS)

Trasforma un valore numerico in una stringa leggibile.

- **Parametri:** `N_SECONDS` (Number).
- **Ritorna:** Stringa in formato `HH:MM:SS`.

## Esempio d'uso

```javascript
var var_n_start = Objectis.getTimestamp();

// ... esecuzione di un processo ...

var var_n_end = Objectis.getTimestamp();
var var_n_duration = (var_n_end - var_n_start) / 1000;

alert("Operazione completata in: " + Objectis.formatTime(var_n_duration));
```

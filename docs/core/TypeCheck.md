# Objectis TypeCheck (v0.0.3)

Questo modulo fornisce i predicati fondamentali per la validazione dei dati. Ogni funzione della libreria deve utilizzare questi metodi prima di processare i parametri.

## Metodi Disponibili

### Objectis.isString(VAR_VAL)

Ritorna `true` se il valore è una stringa primitiva o un oggetto String.

### Objectis.isNumber(VAR_VAL)

Ritorna `true` se il valore è un numero e non è `NaN` o `Infinity`.

### Objectis.isObject(VAR_VAL)

Ritorna `true` se il valore è un oggetto. Nota: in JS `null` è un oggetto, ma questa funzione ritorna `false` per `null`.

### Objectis.isFunction(VAR_VAL)

Ritorna `true` se il valore può essere invocato come funzione.

## Esempio d'uso

```javascript
function miaFunzione(S_NOME) {
  if (!Objectis.isString(S_NOME)) {
    Objectis.logError("miaFunzione: S_NOME deve essere stringa");
    return;
  }
  // ... logica ...
}
```

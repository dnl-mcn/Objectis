# Objectis Memory (v0.0.9)

Questo modulo è vitale per le Single Page Application (SPA) legacy. Impedisce l'accumulo di memoria RAM causato dai riferimenti circolari tra il motore JScript e il DOM.

## Metodi Disponibili

### Objectis.nullify(O_EL)

Spezza i legami tra JavaScript e l'elemento DOM. Da invocare ogni volta che un componente viene rimosso dalla pagina o distrutto.

- **Azione:** Imposta a `null` gli eventi e le proprietà custom.

### Objectis.purgeData(A_ELEMENTS)

Esegue un ciclo di `nullify` su un'intera collezione di oggetti.

## Best Practice

Sempre invocare `nullify` prima di utilizzare `removeChild` o impostare `innerHTML = ""`, specialmente se gli elementi rimossi avevano degli eventi collegati.

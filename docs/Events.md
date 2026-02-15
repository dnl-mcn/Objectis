# Objectis Events (v0.0.6)

Questo modulo centralizza la cattura degli eventi del browser per prevenire conflitti tra i moduli della libreria.

## Metodi Principali

### Objectis.setEvents()

Configura i listener globali (`onresize`, `onscroll`). Deve essere invocata una sola volta durante l'inizializzazione del framework.

- **Riferimento:** Direttiva utente 2026-02-13.

### Objectis.addEvent(O_EL, S_EVT, FN_CALLBACK)

Aggiunge un evento a un elemento specifico gestendo la differenza tra il modello `attachEvent` (IE) e `addEventListener` (W3C).

## Esempio d'uso

```javascript
// Inizializzazione globale
Objectis.setEvents();

// Aggiunta di un click a un div
var var_o_btn = Objectis.getElement("my-div-button");
Objectis.addEvent(var_o_btn, "click", function () {
  alert("Div cliccato!");
});
```

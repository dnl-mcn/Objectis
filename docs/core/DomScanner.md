# Objectis DomScanner (v0.1.2)

Il `DomScanner` è il motore di attivazione automatica della libreria. Il suo compito è trasformare elementi statici definiti nell'HTML in componenti dinamici interattivi, senza la necessità di scrivere codice JavaScript "inline".

## Descrizione Funzionale

Il modulo scansiona il Document Object Model alla ricerca di tag `<div>` che possiedono classi CSS specifiche con prefisso `obj-`. Una volta identificato un elemento, lo scanner agisce come una **Factory**, invocando il costruttore del componente UI corrispondente.

## Metodi Disponibili

### Objectis.scanDocument(O_ROOT)

Esegue una scansione ricorsiva degli elementi partendo dalla radice specificata.

- **Parametri:** `O_ROOT` (Object, opzionale). Se omesso, la scansione parte da `document`.
- **Esecuzione:** Viene solitamente invocata una sola volta dal modulo `Objectis.js` al termine del caricamento della pagina (`window.onload`).

## Mappatura Componenti (Registry)

Attualmente lo scanner riconosce e istanzia i seguenti componenti:

| Classe CSS   | Costruttore Invocato    | Modulo Richiesto  |
| :----------- | :---------------------- | :---------------- |
| `obj-button` | `Objectis.Button(O_EL)` | `js/ui/Button.js` |

## Convenzione Naming

Per essere correttamente rilevato e attivato, un elemento deve seguire questo standard:

```html
<div class="obj-button" id="my-action-btn">Clicca Qui</div>
```

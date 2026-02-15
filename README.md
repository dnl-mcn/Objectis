# Objectis Library v0.0.1

**Objectis** è un framework JavaScript legacy-first progettato per fornire un'interfaccia utente coerente, robusta e orientata agli oggetti. È costruito per garantire la compatibilità totale a partire da **Internet Explorer 6** su standard **HTML 4.01 Strict**.

## 1. Architettura e Filosofia
La libreria trasforma elementi strutturali (`div`) in componenti interattivi complessi (Interfacce), eliminando l'uso di tag `form` nativi e script inline. Il core gestisce automaticamente il ciclo di vita dei moduli, le dipendenze e l'inizializzazione tramite scansione di classi CSS specifiche.



---

## 2. Roadmap di Sviluppo (Priorità di Esecuzione)
*Il numero di versione verrà incrementato ad ogni rilascio di un nuovo modulo o modifica strutturale.*

1.  **Namespace & Global Scope:** Incapsulamento totale sotto l'oggetto `Objectis`.
2.  **Naming & Style Convention:** camelCase per metodi, PascalCase per Classi, `var_type_` per variabili e `const_TYPE_` per costanti.
3.  **TypeCheck (Validazione Rigorosa):** Controllo preventivo di ogni tipo di dato per ogni funzione.
4.  **Error Catching (HTML Log):** Intercettazione errori e stampa in un elemento `<pre>` dedicato nell'HTML.
5.  **Usage Stats & Debug Flag:** Conteggio chiamate alle funzioni e flag di debug per monitoraggio performance.
6.  **Atomicità dei Moduli:** File estremamente corti e focalizzati. Ogni file `.js` deve avere il suo file `.md` di istruzioni ed esempi.
7.  **Time-Event Manager (TimeEngine):** Gestione centralizzata di timestamp e intervalli temporali.
8.  **Autoload & Dependency Manager:** Caricamento dinamico dei moduli necessari.
9.  **Multi-Event Dispatcher:** Gestione simultanea di eventi globali (`window.onresize`, `window.onscroll`).
10. **DomQuery Utility:** Funzioni di cattura elementi DOM (ID e Classi) compatibili con IE6.
11. **Auto-Instancing (DomScanner):** Attivazione dei componenti tramite scansione classi `obj-`.
12. **Anti-Leak Memory Management:** Pulizia attiva (`nullify`) dei riferimenti per motori JScript.
13. **Astrazione Box Model:** Normalizzazione geometrica per layout Strict Mode.
14. **Custom UI Base:** Creazione di Interfacce (Button, Toggle, Radio, Checkbox) usando esclusivamente `div`.
15. **Advanced UI Components:** Slider, Grafici, Box ridimensionabili (Resizable).
16. **Async (Ajax/ActiveX):** Gestione chiamate asincrone cross-browser.

---

## 3. Standard di Naming e Tipizzazione

### Convenzioni Generali
| Elemento | Convenzione | Esempio |
| :--- | :--- | :--- |
| **Classi** | PascalCase | `Objectis.Slider` |
| **Funzioni / Metodi** | camelCase | `Objectis.updatePosition` |
| **Parametri Funzione** | TUTTO_MAIUSCOLO | `(O_EL, N_VAL)` |
| **Variabili** | `var_` + tipo + nome | `var_n_currentValue` |
| **Costanti** | `const_` + TIPO + NOME | `const_N_MAX_LIMIT` |

### Prefissi di Tipo (Obbligatori)
* `s_` / `S_` : Stringa
* `n_` / `N_` : Numero
* `b_` / `B_` : Booleano
* `o_` / `O_` : Oggetto / Elemento DOM
* `a_` / `A_` : Array
* `fn_` / `FN_` : Funzione

---

## 4. Requisiti Tecnici e Vincoli
* **HTML 4.01 Strict:** Validazione obbligatoria del markup.
* **No Form Elements:** Vietato l'uso di `<input>`, `<select>`, `<button>`, ecc.
* **No Inline JS:** JavaScript presente solo in file esterni. L'unico richiamo è il Core nell'header.
* **Indipendenza:** Zero librerie esterne (No jQuery, No altri framework).

---

## 5. Documentazione Funzioni (Stile C)
Ogni metodo deve essere preceduto da un header descrittivo:
```javascript
/**
 * @function nomeMetodo
 * @description Descrizione sintetica dell'azione.
 * @param {Tipo} TIPO_PARAMETRO - Descrizione.
 * @return {Tipo} var_tipo_nome - Descrizione valore di ritorno.
 */
 ```
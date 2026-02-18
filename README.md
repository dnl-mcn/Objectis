# Objectis Framework v1.0.0

## Objectis è un framework JavaScript legacy-first progettato per fornire un'interfaccia utente coerente, robusta e orientata agli oggetti. È costruito per antire la compatibilità totale a partire da Internet Explorer 6 su standard HTML 4.01 Strict.

## 1. Architettura e Filosofia

La libreria trasforma elementi strutturali neutri (div) in componenti interattivi complessi, eliminando l'uso di tag form nativi e script inline. Il core tisce automaticamente il ciclo di vita dei moduli, le dipendenze e l'inizializzazione tramite scansione di classi CSS specifiche.

### Principi Cardine:

- Zero Tag Standard: Vietato l'uso di input, select, button, form, label e textarea.
- Metadata via Classi: Ogni parametro (chiavi di binding, label, regole di validazione) è veicolato tramite classi CSS (es. cls-key-nome).
- Niente Cookie Standard: La persistenza è affidata a uno "Pseudo-Cookie" (elemento <object>) per evitare direttive sui cookie e gestire i dati nel DOM.
- Unobtrusive JS: JavaScript presente solo in file esterni. L'unico richiamo ammesso è il bootloader nell'header.

---

## 2. Standard di Naming e Tipizzazione (Rigoroso)

Il framework segue una convenzione di stile derivata dai sistemi embedded e dal linguaggio C per garantire zero ambiguità.

### Convenzioni Generali

| Elemento           | Convenzione           | Esempio              |
| :----------------- | :-------------------- | :------------------- |
| Classi (Prototype) | PascalCase            | Objectis.CustomInput |
| Funzioni / Metodi  | camelCase             | Objectis.setEvents   |
| Parametri Funzione | TUTTO_MAIUSCOLO       | (O_EL, N_VAL)        |
| Variabili Locali   | var\_ + tipo + nome   | var_n_index          |
| Costanti           | const\_ + TIPO + NOME | const_N_MAX_LIMIT    |

### Prefissi di Tipo (Obbligatori)

- s* / S* : Stringa
- n* / N* : Numero
- b* / B* : Booleano
- o* / O* : Oggetto / Elemento DOM
- a* / A* : Array
- fn* / FN* : Funzione

---

## 3. Roadmap di Sviluppo e Moduli Core

1.  Namespace & Global Scope: Incapsulamento totale sotto Objectis.
2.  Error Catching (HTML Log): Intercettazione errori e stampa in console custom.
3.  Usage Stats: Conteggio chiamate tramite Objectis.trackCall(S_NAME).
4.  Pseudo-Cookie (Storage): Gestione dello stato dell'applicazione senza cookie HTTP.
5.  DomScanner: Attivazione automatica dei componenti tramite prefisso obj-.
6.  Events Manager: Gestione centralizzata in setEvents e dispacciamento tramite fireEvent.
7.  Async (Ajax): Chiamate XHR cross-browser con gestione errore HTTP 0.
8.  Validation: Motore di validazione dichiarativo basato su classi (cls-val-numeric).

---

## 4. Implementazione UI (Esempi)

### Componente Input (Simulato)

Un div con contentEditable che funge da campo di testo numerico:
html %% <div class="obj-custom-input cls-key-prezzo cls-val-numeric">0</div> %%

### Componente Button

Un bottone con label dinamica e gestione eventi:
html %% <div id="btn-save" class="obj-button cls-label-Salva_Dati"></div> %%

### Data Binding

Ogni elemento con classe obj-bind si aggiorna automaticamente al variare del valore nel registro:
html %% <div class="obj-bind cls-key-prezzo">Valore: 0</div> %%

---

## 5. Requisiti e Vincoli Tecnici

- Documentazione: Ogni metodo deve essere preceduto da header @function, @description, @param e @return.
- Anti-Leak: I riferimenti agli oggetti DOM devono essere annullati (null) alla distruzione dei moduli per prevenire memory leak in JScript (IE6).
- Strict Mode: Il markup deve validare come HTML 4.01 Strict.

---

## 6. Manutenzione Git

Per ogni modifica strutturale o aggiunta di modulo, è obbligatorio seguire il flusso:

1. git add [file]
2. git commit -m "[tipo]: [descrizione]"
3. git push

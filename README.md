# Objectis Framework v1.4.8

**Legacy Browser UI Engine**

[FRAMEWORK_LOGIC_START]
Objectis è un engine UI cross-browser focalizzato sulla compatibilità legacy (IE6+).
Il cuore del sistema è un processo a due fasi: **Bootstrapping Core** e **Dynamic UI Discovery**.

### Flusso Logico

1. **Core Initialization**: Caricamento asincrono di `Dom.js`, `DomScanner.js` e `Ajax.js`.
2. **Scanner Execution**: Identificazione automatica di elementi `obj-*` nel DOM.
3. **Module Injection**: Caricamento on-demand dei file in `js/ui/` basato sulle classi trovate.
4. **Binding & Init**: Creazione delle istanze e attivazione degli eventi definiti in `setevents`.
   [FRAMEWORK_LOGIC_END]

[COMPONENT_SPEC_START]

### Componenti e Caratteristiche

- **Button**: Supporto cross-browser per eventi mouse e gestione label.
- **Panel**: Struttura modulare con supporto `HasLayout`.
- **Slider (v1.2.5)**:
  - Orientamento dinamico (H/V).
  - Calcolo preciso del posizionamento tramite `getRect`.
  - Connessione autonoma: lo slider riconosce il target di scroll (es. `#system-log-container`) e si auto-sincronizza.
    [COMPONENT_SPEC_END]

[GIT_STORY_START]

### Changelog Recente

- **Rollback & Stability**: Ripristinata stabilità dopo i test di orientamento orizzontale.
- **Precision Fix**: Corretto l'offset del cursore eliminando interferenze CSS.
- **Timing Logic**: Introdotta `requestFrame` nel Core per stabilizzare l'inizializzazione asincrona dei componenti.
  [GIT_STORY_END]

---

_Status: Stable - Version 1.4.8_

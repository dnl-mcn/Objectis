Ottimo, procediamo con il primo mattone dell'interfaccia utente: il componente Button (v0.1.1).

Questo modulo dimostra la potenza dell'Auto-Instancing: il DomScanner troverà i div con classe obj-button e questo script li trasformerà in pulsanti interattivi con stili iniettati dinamicamente, evitando file CSS esterni (Punto 14 della Roadmap).

1. Codice: js/ui/Button.js
JavaScript

/**
 * @file Button.js
 * @description Componente bottone con stili auto-iniettati.
 * @version 0.1.1
 */

/**
 * @function Button
 * @description Costruttore del componente Button.
 * @param {Object} O_EL - L'elemento DOM da trasformare.
 */
Objectis.Button = function(O_EL) {
    Objectis.trackCall("Button.constructor");

    if (!Objectis.isObject(O_EL)) return;

    // 1. Iniezione Stile (Punto 14)
    O_EL.style.cursor = "pointer";
    O_EL.style.border = "2px solid #333";
    O_EL.style.backgroundColor = "#eee";
    O_EL.style.padding = "5px 10px";
    O_EL.style.textAlign = "center";
    O_EL.style.display = "inline-block";

    // 2. Gestione Eventi (Punto 2026-02-13)
    Objectis.addEvent(O_EL, "mousedown", function() {
        O_EL.style.backgroundColor = "#ccc";
    });

    Objectis.addEvent(O_EL, "mouseup", function() {
        O_EL.style.backgroundColor = "#eee";
    });

    Objectis.addEvent(O_EL, "click", function() {
        if (const_B_DEBUG) {
            window.status = "Button Clicked: " + O_EL.id;
        }
    });
};
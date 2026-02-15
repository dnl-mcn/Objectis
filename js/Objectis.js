/**
 * @file Objectis.js
 * @description Entry-point e inizializzatore globale del framework Objectis.
 * @version 0.0.11
 */

/**
 * @function init
 * @description Avvia la sequenza di inizializzazione di tutti i moduli caricati.
 */
Objectis.init = function() {
    Objectis.trackCall("init");

    if (const_B_DEBUG) {
        Objectis.logError("--- Objectis Framework Booting ---");
    }

    // 1. Configurazione eventi globali (Punto 2026-02-13)
    Objectis.setEvents();

    // 2. Scansione del DOM per l'Auto-Instancing (Punto 11)
    Objectis.scanDocument();

    if (const_B_DEBUG) {
        var var_n_ts = Objectis.getTimestamp();
        Objectis.logError("Boot completato al timestamp: " + var_n_ts);
        Objectis.logError("Chiamate totali registrate: " + var_o_stats.var_n_totalCalls);
    }
};

/**
 * Avvio automatico al caricamento della finestra.
 * Utilizziamo addEvent per non sovrascrivere altri script.
 */
Objectis.addEvent(window, "load", function() {
    Objectis.init();
});
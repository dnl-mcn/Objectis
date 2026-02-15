/**
 * @file Memory.js
 * @description Gestore per la prevenzione dei memory leak e pulizia dei riferimenti.
 * @version 0.0.9
 */

/**
 * @function nullify
 * @description Rimuove i riferimenti circolari e pulisce l'elemento DOM per il Garbage Collector.
 * @param {Object} O_EL - L'elemento da "bonificare".
 */
Objectis.nullify = function(O_EL) {
    Objectis.trackCall("nullify");

    if (!Objectis.isObject(O_EL)) {
        Objectis.logError("nullify: O_EL non è un oggetto valido.");
        return;
    }

    // Rimuove gli handler degli eventi comuni per spezzare i riferimenti
    O_EL.onclick = null;
    O_EL.onmouseover = null;
    O_EL.onmouseout = null;
    
    // Rimuove riferimenti a espansioni custom di Objectis
    if (O_EL.o_component) {
        O_EL.o_component = null;
    }

    if (const_B_DEBUG) {
        window.status = "Memory: Element nullified to prevent leaks.";
    }
};

/**
 * @function purgeData
 * @description Pulisce un intero array di elementi.
 * @param {Array} A_ELEMENTS - Array di elementi DOM.
 */
Objectis.purgeData = function(A_ELEMENTS) {
    Objectis.trackCall("purgeData");

    if (!Objectis.isObject(A_ELEMENTS)) {
        return;
    }

    var var_n_i = 0;
    for (var_n_i = 0; var_n_i < A_ELEMENTS.length; var_n_i++) {
        Objectis.nullify(A_ELEMENTS[var_n_i]);
    }
};
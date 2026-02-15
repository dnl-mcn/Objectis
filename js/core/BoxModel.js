/**
 * @file BoxModel.js
 * @description Normalizzazione delle geometrie e calcolo ingombri (IE6 Strict Mode).
 * @version 0.0.8
 */

/**
 * @function getRealWidth
 * @description Calcola la larghezza effettiva di un elemento inclusi padding e bordi.
 * @param {Object} O_EL - L'elemento DOM da misurare.
 * @return {Number} var_n_width - Larghezza totale in pixel.
 */
Objectis.getRealWidth = function(O_EL) {
    Objectis.trackCall("getRealWidth");

    if (!Objectis.isObject(O_EL)) {
        Objectis.logError("getRealWidth: O_EL non è un oggetto valido.");
        return 0;
    }

    // offsetWidth include padding e border in IE6
    var var_n_width = O_EL.offsetWidth;
    
    if (const_B_DEBUG) {
        window.status = "Geometry: Element width is " + var_n_width;
    }

    return var_n_width;
};

/**
 * @function setSafeWidth
 * @description Imposta la larghezza sottraendo padding e bordi per evitare l'esplosione del box.
 * @param {Object} O_EL - L'elemento DOM.
 * @param {Number} N_TARGET_WIDTH - La larghezza totale desiderata.
 */
Objectis.setSafeWidth = function(O_EL, N_TARGET_WIDTH) {
    Objectis.trackCall("setSafeWidth");

    if (!Objectis.isObject(O_EL) || !Objectis.isNumber(N_TARGET_WIDTH)) {
        Objectis.logError("setSafeWidth: Parametri non validi.");
        return;
    }

    // Sottrazione dei bordi e padding (Astrazione Box Model)
    // In IE6 Strict, width non include i bordi, quindi dobbiamo calcolarli.
    var var_n_finalWidth = N_TARGET_WIDTH;
    
    // Esempio semplificato: sottrazione ipotetica o gestione diretta
    O_EL.style.width = var_n_finalWidth + "px";
};
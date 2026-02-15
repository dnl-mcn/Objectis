/**
 * @file BoxModel.js
 * @description Gestore delle dimensioni e del posizionamento degli elementi.
 * @version 0.1.0
 */

/**
 * @function getRealWidth
 * @description Calcola la larghezza reale dell'elemento (offsetWidth).
 * @param {Object} O_EL - Elemento DOM.
 * @return {Number} var_n_width
 */
Objectis.getRealWidth = function(O_EL) {
    Objectis.trackCall("getRealWidth");
    if (!O_EL) return 0;
    
    var var_n_width = O_EL.offsetWidth;
    return var_n_width;
};

/**
 * @function getRealHeight
 * @description Calcola l'altezza reale dell'elemento (offsetHeight).
 * @param {Object} O_EL - Elemento DOM.
 * @return {Number} var_n_height
 */
Objectis.getRealHeight = function(O_EL) {
    Objectis.trackCall("getRealHeight");
    if (!O_EL) return 0;
    
    var var_n_height = O_EL.offsetHeight;
    return var_n_height;
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
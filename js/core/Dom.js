/**
 * @file Dom.js
 * @description Utility per la manipolazione del DOM.
 */

Objectis.setStyle = function(O_EL, O_STYLES) {
    Objectis.trackCall("setStyle");
    
    if (!O_EL || !O_EL.style) {
        if (const_B_DEBUG) { Objectis.logError("setStyle: Elemento o stile non valido."); }
        return;
    }

    for (var var_s_prop in O_STYLES) {
        var var_s_val = O_STYLES[var_s_prop];
        try {
            // Applichiamo lo stile (es: backgroundColor)
            O_EL.style[var_s_prop] = var_s_val;
        } catch (var_o_err) {
            if (const_B_DEBUG) {
                Objectis.logError("Errore stile: " + var_s_prop + " su " + O_EL.id);
            }
        }
    }
};

/**
 * @function getParam
 * @description Legge un attributo dall'elemento e restituisce un default se manca.
 * @param {Object} O_EL - Elemento DOM.
 * @param {String} S_NAME - Nome dell'attributo.
 * @param {String} S_DEFAULT - Valore di ritorno se l'attributo non esiste.
 * @return {String} var_s_value
 */
Objectis.getParam = function(O_EL, S_NAME, S_DEFAULT) {
    Objectis.trackCall("getParam");
    var var_s_value = O_EL.getAttribute(S_NAME);
    return (var_s_value !== null && var_s_value !== "") ? var_s_value : S_DEFAULT;
};
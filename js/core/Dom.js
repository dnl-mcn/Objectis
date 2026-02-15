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
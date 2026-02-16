/**
 * @file Dom.js
 * @description Utility per la manipolazione del DOM.
 */

Objectis.setStyle = function(O_EL, O_STYLES) {
    Objectis.trackCall("setStyle");
    if (!O_EL || !O_EL.style) return;

    for (var var_s_prop in O_STYLES) {
        var var_s_val = O_STYLES[var_s_prop];
        // In IE6/Chrome, scrivere direttamente sulla proprietà è più veloce
        O_EL.style[var_s_prop] = var_s_val;
        
        // Se stiamo cercando di nascondere, assicuriamoci che accada
        if (var_s_prop === "display" && var_s_val === "none") {
            O_EL.style.visibility = "hidden"; // Doppio colpo per sicurezza
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

/**
 * @function setContent
 * @description Aggiorna il testo o l'HTML di un elemento.
 */
Objectis.setContent = function(O_EL, var_s_value) {
    Objectis.trackCall("setContent");
    if (!O_EL) return;
    
    // Gestione compatibile: se è un input usa value, altrimenti innerHTML
    if (O_EL.tagName === "INPUT" || O_EL.tagName === "TEXTAREA") {
        O_EL.value = var_s_value;
    } else {
        O_EL.innerHTML = var_s_value;
    }
};

/**
 * @function syncElement
 * @description Sincronizza un elemento con un valore del registro.
 */
Objectis.syncElement = function(O_EL, S_KEY) {
    Objectis.trackCall("syncElement");
    var var_s_val = Objectis.getPseudoCookie(S_KEY, "");
    if (var_s_val !== "") {
        Objectis.setContent(O_EL, var_s_val);
    }
};
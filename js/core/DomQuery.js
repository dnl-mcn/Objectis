/**
 * @file DomQuery.js
 * @description Funzioni di utilità per la cattura di elementi singoli o multipli.
 * @version 0.0.1.4
 */

/**
 * @function getElement
 * @description Cattura un singolo elemento tramite ID.
 * @param {String} S_ID - L'identificativo univoco dell'elemento.
 * @return {Object} var_o_element - L'elemento DOM o null.
 */
Objectis.getElement = function(S_ID) {
    Objectis.trackCall("getElement"); // Punto 21: Statistiche
    
    if (!Objectis.isString(S_ID)) {
        Objectis.logError("getElement: S_ID deve essere una stringa");
        return null;
    }
    
    var var_o_element = document.getElementById(S_ID);
    return var_o_element;
};

/**
 * @function getElementsByClass
 * @description Cattura una collezione di elementi tramite nome classe (Compatibile IE6).
 * @param {String} S_CLASS - Nome della classe CSS.
 * @param {Object} O_PARENT - (Opzionale) Elemento radice in cui cercare.
 * @return {Array} var_a_elements - Array di elementi DOM trovati.
 */
Objectis.getElementsByClass = function(S_CLASS, O_PARENT) {
    Objectis.trackCall("getElementsByClass");
    
    var var_o_root = O_PARENT || document;
    var var_a_allElements = var_o_root.getElementsByTagName("*");
    var var_a_elements = [];
    var var_n_i = 0;
    
    for (var_n_i = 0; var_n_i < var_a_allElements.length; var_n_i++) {
        var var_o_current = var_a_allElements[var_n_i];
        // Verifica manuale della classe per compatibilità IE6
        if (var_o_current.className && var_o_current.className.indexOf(S_CLASS) !== -1) {
            var_a_elements.push(var_o_current);
        }
    }
    
    return var_a_elements;
};
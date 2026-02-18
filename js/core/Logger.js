/**
 * @file Logger.js
 * @description Sistema di logging grafico per Objectis.
 * @version 1.0.4
 */

if (typeof Objectis === "undefined") {
    var Objectis = { var_a_components: {}, const_B_DEBUG: true };
}

/**
 * @function log
 * @description Stampa un messaggio nel log di sistema e in console.
 * @param {String} var_s_msg - Messaggio da visualizzare.
 * @param {String} var_s_type - Tipo di log (INFO, SUCCESS, ERROR, STORAGE).
 */
Objectis.log = function(var_s_msg, var_s_type) {
    var var_s_t = var_s_type || "INFO";
    var var_o_container = document.getElementById("system-log-container");
    
    // Log in console per debug permanente
    if (typeof console !== "undefined") {
        console.log("[Objectis] (" + var_s_t + ") " + var_s_msg);
    }

    if (var_o_container) {
        var var_o_entry = document.createElement("div");
        var_o_entry.className = "log-entry log-" + var_s_t.toLowerCase();
        var_o_entry.innerHTML = "<strong>[" + var_s_t + "]</strong> " + var_s_msg;
        
        // Inserimento in cima al log
        if (var_o_container.firstChild) {
            var_o_container.insertBefore(var_o_entry, var_o_container.firstChild);
        } else {
            var_o_container.appendChild(var_o_entry);
        }
    }
};

/**
 * @function logError
 * @description Scorciatoia per log di tipo errore.
 * @param {String} var_s_msg - Messaggio di errore.
 */
Objectis.logError = function(var_s_msg) {
    Objectis.log(var_s_msg, "ERROR");
};

Objectis.log("Modulo caricato: core/Logger.js", "BOOT");
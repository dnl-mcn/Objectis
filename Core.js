/**
 * @file Core.js
 * @description Nucleo centrale della libreria Objectis. Gestisce log, errori e statistiche.
 * @version 0.0.2
 */

var Objectis = {};

// Flag di debug (Punto 5 del README)
var const_B_DEBUG = true;

// Struttura per le statistiche (Punto 5 del README)
var var_o_stats = {
    var_n_totalCalls: 0,
    var_o_moduleCalls: {}
};

/**
 * @function logError
 * @description Intercetta e stampa gli errori nell'HTML (Punto 4 del README).
 * @param {String} S_MSG - Il messaggio di errore da visualizzare.
 */
Objectis.logError = function(S_MSG) {
    var var_o_logBoard = document.getElementById("obj-debug-log");
    
    // Se non esiste l'area di log, la crea dinamicamente
    if (!var_o_logBoard) {
        var_o_logBoard = document.createElement("pre");
        var_o_logBoard.id = "obj-debug-log";
        var_o_logBoard.style.color = "red";
        var_o_logBoard.style.border = "1px solid #ccc";
        document.body.appendChild(var_o_logBoard);
    }
    
    var_o_logBoard.innerHTML += "[ERROR] " + S_MSG + "\n";
};

/**
 * @function trackCall
 * @description Conteggia le chiamate alle funzioni per fini statistici.
 * @param {String} S_FUNC_NAME - Nome della funzione chiamata.
 */
Objectis.trackCall = function(S_FUNC_NAME) {
    var_o_stats.var_n_totalCalls++;
    
    if (!var_o_stats.var_o_moduleCalls[S_FUNC_NAME]) {
        var_o_moduleCalls[S_FUNC_NAME] = 0;
    }
    var_o_stats.var_o_moduleCalls[S_FUNC_NAME]++;
    
    if (const_B_DEBUG && window.status) {
        window.status = "Calls: " + var_o_stats.var_n_totalCalls;
    }
};
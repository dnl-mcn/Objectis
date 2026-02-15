/**
 * @file Core.js
 * @description Kernel del framework Objectis: gestione dipendenze, statistiche e autoload.
 * @version 0.1.5
 */

// Definizione namespace globale
var Objectis = {};

/**
 * @description Costanti globali di sistema.
 * @constant {Boolean} const_B_DEBUG - Attiva le funzioni di log e tracciamento.
 */
var const_B_DEBUG = true;

/**
 * @description Oggetto per la raccolta di metriche e stati del sistema.
 * @var {Object} var_o_stats
 */
var var_o_stats = {
    var_n_totalCalls: 0,
    var_o_moduleCalls: {}
};

/**
 * @description Registro dei moduli caricati per la prevenzione dei duplicati.
 * @var {Object} var_o_registry
 */
Objectis.var_o_registry = {};

/**
 * @function trackCall
 * @description Conteggia le chiamate alle funzioni per fini statistici.
 * @param {String} S_FUNC_NAME - Nome della funzione chiamata.
 */
Objectis.trackCall = function(S_FUNC_NAME) {
    var_o_stats.var_n_totalCalls++;
    
    if (!var_o_stats.var_o_moduleCalls[S_FUNC_NAME]) {
        var_o_stats.var_o_moduleCalls[S_FUNC_NAME] = 0;
    }
    var_o_stats.var_o_moduleCalls[S_FUNC_NAME]++;
    
    if (const_B_DEBUG && window.status) {
        window.status = "Calls: " + var_o_stats.var_n_totalCalls;
    }
};

/**
 * @function logError
 * @description Visualizza messaggi di sistema nell'area di log dedicata.
 * @param {String} S_MSG - Messaggio da visualizzare.
 */
Objectis.logError = function(S_MSG) {
    Objectis.trackCall("logError");
    var var_o_log = document.getElementById("obj-debug-log");
    if (var_o_log) {
        var_o_log.innerHTML += "<div>[Objectis] " + S_MSG + "</div>";
    }
};

/**
 * @function loadModule
 * @description Carica un modulo tramite iniezione nel DOM (No document.write).
 * @param {String} S_PATH - Percorso del file.
 * @param {Array} A_DEPS - Dipendenze.
 */
Objectis.loadModule = function(S_PATH, A_DEPS) {
    Objectis.trackCall("loadModule");

    if (A_DEPS && typeof A_DEPS === "object") {
        var var_n_i = 0;
        for (var_n_i = 0; var_n_i < A_DEPS.length; var_n_i++) {
            Objectis.loadModule(A_DEPS[var_n_i]);
        }
    }

    if (Objectis.var_o_registry[S_PATH]) return;
    Objectis.var_o_registry[S_PATH] = "loading";

    // Creazione dinamica del tag script
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    var_o_script.src = "js/" + S_PATH;

    // Gestione caricamento per browser diversi
    var_o_script.onload = function() { Objectis.var_o_registry[S_PATH] = "loaded"; };
    
    // Supporto specifico per IE6/7/8 (onreadystatechange)
    var_o_script.onreadystatechange = function() {
        if (this.readyState === "complete" || this.readyState === "loaded") {
            Objectis.var_o_registry[S_PATH] = "loaded";
        }
    };

    var var_o_head = document.getElementsByTagName("head")[0];
    var_o_head.appendChild(var_o_script);
};

/**
 * @function boot
 * @description Carica i moduli minimi indispensabili per il funzionamento del motore.
 */
Objectis.boot = function() {
    Objectis.loadModule("core/TypeCheck.js");
    Objectis.loadModule("core/TimeEngine.js");
    Objectis.loadModule("core/Dom.js");
    Objectis.loadModule("core/BoxModel.js"); // Caricato nel set iniziale
    Objectis.loadModule("core/DomQuery.js", ["core/TypeCheck.js"]);
    Objectis.loadModule("core/Events.js");
    
    // Lo Scanner ora dipende anche dal BoxModel per i componenti UI
    Objectis.loadModule("core/DomScanner.js", ["core/Dom.js", "core/BoxModel.js"]);
    
    Objectis.loadModule("core/Objectis.js", ["core/TimeEngine.js", "core/Events.js", "core/DomScanner.js"]);
};

/**
 * @function loadStyle
 * @description Inietta un tag <link> nel document per caricare CSS.
 */
Objectis.loadStyle = function(S_PATH) {
    Objectis.trackCall("loadStyle");
    
    var var_s_id = "css-" + S_PATH.replace(/\//g, "-").replace(/\./g, "-");
    if (document.getElementById(var_s_id)) return;

    var var_o_link = document.createElement("link");
    var_o_link.id = var_s_id;
    var_o_link.rel = "stylesheet";
    var_o_link.type = "text/css";
    var_o_link.href = S_PATH;

    // Gestione errore caricamento
    var_o_link.onerror = function() {
        Objectis.logError("ERRORE: Impossibile caricare il CSS in " + S_PATH);
    };

    document.getElementsByTagName("head")[0].appendChild(var_o_link);
};
// Esecuzione del bootstrap immediato
Objectis.boot();
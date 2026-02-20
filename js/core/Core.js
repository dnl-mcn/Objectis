/**
 * @file Core.js
 * @description Kernel del framework Objectis: gestione dipendenze e bootloader sincronizzato e idempotente.
 * @version 1.0.6
 */

var Objectis = {
    var_n_modulesToLoad: 0,
    var_n_modulesLoaded: 0,
    a_modules: [],
    var_b_isBooted: false,
    var_b_bootStarted: false // Lucchetto di sicurezza contro il doppio avvio
};

/**
 * @constant {Boolean} const_B_DEBUG - Flag per abilitare i log estesi.
 */
var const_B_DEBUG = true;

/**
 * @function log
 * @description Visualizza messaggi di sistema nel DIV di debug e in console.
 * @param {String} S_MSG - Testo del messaggio.
 * @param {String} S_TYPE - Tipo di log (INFO, BOOT, ERROR, READY).
 */
Objectis.log = function(S_MSG, S_TYPE) {
    var var_s_type = S_TYPE || "INFO";
    var var_o_console = document.getElementById("obj-debug-console");
    var var_s_out = "[" + var_s_type + "] " + S_MSG;
    
    if (window.console) {
        console.log("[Objectis] (" + var_s_type + ") " + S_MSG);
    }
    
    if (var_o_console) {
        if (var_s_type === "BOOT" && S_MSG.indexOf("Inizializzazione") !== -1) {
            var_o_console.innerHTML = ""; 
        }
        var_o_console.innerHTML += var_s_out + "<br>";
        var_o_console.scrollTop = var_o_console.scrollHeight;
    }
};

/**
 * @function logError
 * @description Metodo specifico per la segnalazione di errori critici.
 * @param {String} S_MSG - Messaggio di errore.
 */
Objectis.logError = function(S_MSG) {
    Objectis.log(S_MSG, "ERROR");
};

/**
 * @function trackCall
 * @description Monitora il numero di chiamate effettuate ai metodi.
 * @param {String} S_FUNC_NAME - Il nome della funzione.
 */
Objectis.trackCall = function(S_FUNC_NAME) {
    // Tracciamento silenziato durante il caricamento base
};

/**
 * @function loadModule
 * @description Inietta uno script e gestisce la sequenza di boot asincrona.
 * @param {String} S_PATH - Percorso del file.
 */
Objectis.loadModule = function(S_PATH) {
    Objectis.var_n_modulesToLoad++;
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    // Timestamp per bypassare la cache durante lo sviluppo
    var_o_script.src = "js/" + S_PATH + "?v=" + new Date().getTime();
    
    var_o_script.onload = function() {
        Objectis.var_n_modulesLoaded++;
        Objectis.log("Modulo caricato: " + S_PATH, "BOOT");
        
        if (Objectis.var_n_modulesLoaded === Objectis.var_n_modulesToLoad) {
            if (typeof Objectis.init === "function" && !Objectis.var_b_isBooted) {
                Objectis.var_b_isBooted = true;
                setTimeout(Objectis.init, 100);
            }
        }
    };
    
    var_o_script.onerror = function() {
        Objectis.logError("Errore nel caricamento del modulo: " + S_PATH);
    };
    
    document.getElementsByTagName("head")[0].appendChild(var_o_script);
};

/**
 * @function boot
 * @description Entry point del sistema. Carica la lista moduli core.
 */
Objectis.boot = function() {
    // Se il boot è già partito, blocchiamo immediatamente l'esecuzione secondaria
    if (Objectis.var_b_bootStarted) {
        return; 
    }
    Objectis.var_b_bootStarted = true;
    
    Objectis.var_n_modulesToLoad = 0;
    Objectis.var_n_modulesLoaded = 0;
    
    Objectis.log("Inizializzazione Objectis...", "BOOT");
    
    var var_a_core = [
        "core/Logger.js",
        "core/Crypto.js",
        "core/TypeCheck.js",
        "core/Dom.js",
        "core/Events.js",
        "core/Storage.js",
        "core/DomScanner.js",
        "core/Ajax.js",
        "ui/panel.js",
        "ui/button.js",
        "core/Objectis.js"
    ];

    for (var var_n_i = 0; var_n_i < var_a_core.length; var_n_i++) {
        Objectis.loadModule(var_a_core[var_n_i]);
    }
};

// Esecuzione protetta
Objectis.boot();
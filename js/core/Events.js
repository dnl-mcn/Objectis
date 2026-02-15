/**
 * @file Events.js
 * @description Gestore centralizzato degli eventi globali.
 * @version 0.0.6
 */

/**
 * @function setEvents
 * @description Inizializza i listener globali e smista gli eventi ai moduli registrati.
 * @notes Gestisce window.onresize e window.onscroll in modo atomico.
 */
Objectis.setEvents = function() {
    Objectis.trackCall("setEvents");

    // Gestione Resize
    window.onresize = function() {
        var var_n_width = document.documentElement.clientWidth || document.body.clientWidth;
        if (const_B_DEBUG) {
            window.status = "Resize: " + var_n_width + "px";
        }
        // Qui verranno chiamati i metodi di aggiornamento dei componenti UI
    };

    // Gestione Scroll
    window.onscroll = function() {
        var var_n_top = document.documentElement.scrollTop || document.body.scrollTop;
        // Logica per lazy loading o effetti parallax legacy
    };

    if (const_B_DEBUG) {
        Objectis.logError("Events: Global listeners initialized via setEvents.");
    }
};

/**
 * @function addEvent
 * @description Helper per aggiungere eventi ad elementi specifici (Cross-browser).
 * @param {Object} O_EL - Elemento DOM.
 * @param {String} S_EVT - Nome evento (es. 'click').
 * @param {Function} FN_CALLBACK - Funzione da eseguire.
 */
Objectis.addEvent = function(O_EL, S_EVT, FN_CALLBACK) {
    Objectis.trackCall("addEvent");

    if (!Objectis.isObject(O_EL) || !Objectis.isFunction(FN_CALLBACK)) {
        Objectis.logError("addEvent: Parametri non validi.");
        return;
    }

    if (O_EL.attachEvent) {
        // Metodo per IE6-8
        O_EL.attachEvent("on" + S_EVT, FN_CALLBACK);
    } else if (O_EL.addEventListener) {
        // Metodo standard
        O_EL.addEventListener(S_EVT, FN_CALLBACK, false);
    }
};
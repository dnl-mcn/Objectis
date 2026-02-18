/**
 * @file Events.js
 * @description Gestore centralizzato degli eventi globali.
 * @version 0.0.7
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
        Objectis.log("Events: Global listeners initialized via setEvents.", "INFO");
    }
};

/**
 * @function addEvent
 * @description Gestore cross-browser per gli eventi (IE6+).
 */
Objectis.addEvent = function(var_o_el, var_s_ev, var_f_func) {
    Objectis.trackCall("addEvent");
    
    if (!var_o_el) return;

    if (var_o_el.addEventListener) {
        // Chrome, Firefox, Safari, IE9+
        var_o_el.addEventListener(var_s_ev, var_f_func, false);
    } else if (var_o_el.attachEvent) {
        // IE6, IE7, IE8
        var var_o_handler = function() {
            return var_f_func.call(var_o_el, window.event);
        };
        var_o_el.attachEvent("on" + var_s_ev, var_o_handler);
    } else {
        var_o_el["on" + var_s_ev] = var_f_func;
    }
};

/**
 * @function fireEvent
 * @description Scatena un evento custom su un elemento o globalmente.
 */
Objectis.fireEvent = function(var_o_el, var_s_eventName, var_o_data) {
    Objectis.trackCall("fireEvent");
    if (const_B_DEBUG) {
        // Correzione: prima era logError, ora è un normale log INFO
        Objectis.log("Evento scatenato: " + var_s_eventName + " su " + (var_o_el.id || "global"), "INFO");
    }
    // Per ora usiamo un sistema di callback semplice compatibile con IE6
    if (var_o_el["on" + var_s_eventName]) {
        var_o_el["on" + var_s_eventName](var_o_data);
    }
};
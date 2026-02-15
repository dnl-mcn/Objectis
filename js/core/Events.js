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
 * @description Gestore cross-browser per gli eventi (IE6+).
 */
Objectis.addEvent = function(O_EL, S_EV, F_FUNC) {
    Objectis.trackCall("addEvent");
    
    if (!O_EL) return;

    if (O_EL.addEventListener) {
        // Chrome, Firefox, Safari, IE9+
        O_EL.addEventListener(S_EV, F_FUNC, false);
    } else if (O_EL.attachEvent) {
        // IE6, IE7, IE8
        var var_o_handler = function() {
            return F_FUNC.call(O_EL, window.event);
        };
        O_EL.attachEvent("on" + S_EV, var_o_handler);
    } else {
        O_EL["on" + S_EV] = F_FUNC;
    }
};
/**
 * @file Ajax.js
 * @description Gestore per le richieste asincrone (Cross-browser ActiveX/XHR).
 * @version 0.0.10
 */

/**
 * @function getXhr
 * @description Crea l'oggetto per la richiesta asincrona in base al browser.
 * @return {Object} var_o_xhr - L'oggetto XHR o ActiveX.
 */
Objectis.getXhr = function() {
    Objectis.trackCall("getXhr");
    var var_o_xhr = null;

    if (window.XMLHttpRequest) {
        // Browser moderni (IE7+, FF, Chrome)
        var_o_xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // Browser legacy (IE6)
        try {
            var_o_xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                var_o_xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E_ERR) {
                Objectis.logError("getXhr: Impossibile creare oggetto ActiveX.");
            }
        }
    }
    return var_o_xhr;
};

/**
 * @function ajaxLoad
 * @description Effettua una richiesta GET semplice.
 * @param {String} S_URL - L'URL da chiamare.
 * @param {Function} FN_CALLBACK - Funzione da eseguire al successo.
 */
Objectis.ajaxLoad = function(S_URL, FN_CALLBACK) {
    Objectis.trackCall("ajaxLoad");

    if (!Objectis.isString(S_URL) || !Objectis.isFunction(FN_CALLBACK)) {
        Objectis.logError("ajaxLoad: Parametri non validi.");
        return;
    }

    var var_o_xhr = Objectis.getXhr();
    if (!var_o_xhr) return;

    var_o_xhr.onreadystatechange = function() {
        if (var_o_xhr.readyState === 4) {
            if (var_o_xhr.status === 200) {
                FN_CALLBACK(var_o_xhr.responseText);
            } else {
                Objectis.logError("ajaxLoad: Errore HTTP " + var_o_xhr.status);
            }
        }
    };

    var_o_xhr.open("GET", S_URL, true);
    var_o_xhr.send(null);
};
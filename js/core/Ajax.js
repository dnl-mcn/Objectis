/**
 * @file Ajax.js
 * @description Modulo AJAX compatibile con IE6 (ActiveXObject).
 * @version 1.1.3
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @function ajax
     * @description Gestore chiamate AJAX con fallback ActiveX per IE6.
     */
    var_o_root.Objectis.ajax = function(var_o_options) {
        var var_o_xhr = null;
        var var_o_self = this;

        // Strategia di creazione XHR per IE6/7/8 vs Moderni
        if (window.XMLHttpRequest) {
            var_o_xhr = new XMLHttpRequest();
        } else {
            try {
                var_o_xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (var_o_e) {
                try {
                    var_o_xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (var_o_err) {
                    this.log("Impossibile creare XMLHTTP su questo browser.", "ERROR");
                }
            }
        }

        if (!var_o_xhr) return;

        var_o_xhr.onreadystatechange = function() {
            if (var_o_xhr.readyState === 4) {
                // IE6 può restituire status 0 per file locali, gestito nel commit precedente
                if (var_o_xhr.status === 200 || var_o_xhr.status === 0) {
                    var var_o_data = null;
                    var var_s_raw = var_o_xhr.responseText;

                    try {
                        // FIX PER IE6: L'oggetto JSON globale non esiste.
                        // Usiamo eval racchiuso tra parentesi tonde per forzare il parsing dell'oggetto.
                        // La sicurezza è garantita se il server è fidato.
                        var_o_data = eval("(" + var_s_raw + ")");
                    } catch (var_o_parseErr) {
                        var_o_self.log("Errore parsing JSON (Legacy Mode): " + var_o_parseErr.message, "ERROR");
                        var_o_data = var_s_raw;
                    }
                    
                    if (var_o_options.onSuccess) {
                        var_o_options.onSuccess(var_o_data);
                    }
                } else {
                    if (var_o_options.onError) {
                        var_o_options.onError("Status AJAX: " + var_o_xhr.status);
                    }
                }
            }
        };

        var var_s_method = var_o_options.method || "GET";
        var_o_xhr.open(var_s_method, var_o_options.url, true);
        
        // Direttiva Niente Cookie (IE6 non supporta withCredentials, ma proteggiamo i moderni)
        try {
            if (typeof var_o_xhr.withCredentials !== "undefined") {
                var_o_xhr.withCredentials = false;
            }
        } catch(var_o_credErr) {}

        this.log("Richiesta avviata verso: " + var_o_options.url, "AJAX");
        var_o_xhr.send(var_o_options.data || null);
    };

})(window);
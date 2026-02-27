/**
 * @file Ajax.js
 * @description Modulo AJAX compatibile con IE6 con gestione timeout tramite TimeEngine.
 * @version 1.2.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    /**
     * @function ajax
     * @description Gestore chiamate AJAX con fallback ActiveX e timeout centralizzato.
     */
    var_o_root.Objectis.ajax = function(var_o_options) {
        var var_o_xhr = null;
        var var_o_self = this;
        var var_b_completed = false; // Flag per evitare esecuzioni doppie col timeout

        // Strategia di creazione XHR per IE6/7/8 vs Moderni
        if (window.XMLHttpRequest) {
            var_o_xhr = new XMLHttpRequest();
        } else {
            try { var_o_xhr = new ActiveXObject("Msxml2.XMLHTTP"); } 
            catch (e) { try { var_o_xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (err) {} }
        }

        if (!var_o_xhr) return;

        // --- GESTIONE TIMEOUT TRAMITE TIMEENGINE ---
        // Default: 10 secondi per le richieste Ajax
        var var_n_timeoutLimit = var_o_options.timeout || 10000;
        
        if (this.TimeEngine) {
            this.TimeEngine.addAction(function() {
                if (!var_b_completed) {
                    var_b_completed = true;
                    try { var_o_xhr.abort(); } catch(e) {}
                    var_o_self.log("Timeout Ajax raggiunto (" + var_n_timeoutLimit + "ms): " + var_o_options.url, "WARNING");
                    if (var_o_options.onError) var_o_options.onError("TIMEOUT");
                }
            }, var_n_timeoutLimit, false); // Reschedule false: se il tempo è scaduto, l'azione deve morire
        }

        var_o_xhr.onreadystatechange = function() {
            if (var_o_xhr.readyState === 4 && !var_b_completed) {
                var_b_completed = true;
                
                // Su IE6 status 0 è comune per file locali
                if (var_o_xhr.status === 200 || var_o_xhr.status === 0) {
                    var var_s_raw = var_o_xhr.responseText;
                    var var_o_data = null;

                    try {
                        // Pulizia per eval: rimuove eventuali BOM o spazi spuri
                        var var_s_clean = var_s_raw.replace(/^\s+|\s+$/g, "");
                        // MODIFICA: eval sicuro per IE6 con parentesi
                        var_o_data = eval("(" + var_s_clean + ")");
                    } catch (var_o_err) {
                        var_o_self.log("Errore eval JSON: " + var_o_err.message, "ERROR");
                        var_o_data = var_s_raw;
                    }

                    if (var_o_options.onSuccess) var_o_options.onSuccess(var_o_data);
                } else {
                    if (var_o_options.onError) var_o_options.onError(var_o_xhr.status);
                }
            }
        };

        var_o_xhr.open(var_o_options.method || "GET", var_o_options.url, true);
        var_o_xhr.send(var_o_options.data || null);
    };

    /**
     * @method Ajax
     * @description Namespace pubblico per chiamate Ajax.
     */
    var_o_root.Objectis.Ajax = {
        get: function(var_s_url, var_f_callback, var_n_timeout) {
            var_o_root.Objectis.ajax({
                url: var_s_url,
                method: "GET",
                timeout: var_n_timeout || 10000,
                onSuccess: var_f_callback,
                onError: function(var_s_err) {
                    var_o_root.Objectis.log("Errore GET (" + var_s_err + "): " + var_s_url, "ERROR");
                }
            });
        }
    };

})(window);
/**
 * @file Ajax.js
 * @description Modulo AJAX compatibile con IE6.
 * @version 1.1.5
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

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
            try { var_o_xhr = new ActiveXObject("Msxml2.XMLHTTP"); } 
            catch (e) { try { var_o_xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (err) {} }
        }

        if (!var_o_xhr) return;

        var_o_xhr.onreadystatechange = function() {
            if (var_o_xhr.readyState === 4) {
                // Su IE6 status 0 è comune per file locali
                if (var_o_xhr.status === 200 || var_o_xhr.status === 0) {
                    var var_s_raw = var_o_xhr.responseText;
                    var var_o_data = null;

                    try {
                        // Pulizia per eval: rimuove eventuali BOM o spazi spuri
                        var var_s_clean = var_s_raw.replace(/^\s+|\s+$/g, "");
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
     * @method get
     * @description Shorthand per richieste GET.
     * @param {String} var_s_url
     * @param {Function} var_f_callback
     */
    var_o_root.Objectis.Ajax = {
        get: function(var_s_url, var_f_callback) {
            var_o_root.Objectis.ajax({
                url: var_s_url,
                method: "GET",
                onSuccess: var_f_callback,
                onError: function(var_s_err) {
                    var_o_root.Objectis.log("Errore GET: " + var_s_err, "ERROR");
                }
            });
        }
    };

})(window);
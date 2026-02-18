/**
 * @file Ajax.js
 * @description Modulo per comunicazioni asincrone conforme HTML 4.01 (ActiveX/XHR).
 * @version 1.1.2
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @function ajax
     * @description Gestore chiamate AJAX cross-browser.
     */
    var_o_root.Objectis.ajax = function(var_o_options) {
        var var_o_xhr;
        var var_o_self = this;

        // Supporto per browser datati (ActiveX) o moderni (XHR)
        if (window.XMLHttpRequest) {
            var_o_xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var_o_xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (!var_o_xhr) {
            this.log("AJAX non supportato dal browser.", "ERROR");
            return;
        }

        var_o_xhr.onreadystatechange = function() {
            if (var_o_xhr.readyState === 4) {
                if (var_o_xhr.status === 200) {
                    var var_o_data = null;
                    try {
                        // Parsing manuale per massima compatibilità
                        var_o_data = eval("(" + var_o_xhr.responseText + ")");
                    } catch (var_o_e) {
                        var_o_data = var_o_xhr.responseText;
                    }
                    
                    if (var_o_options.onSuccess) {
                        var_o_options.onSuccess(var_o_data);
                    }
                } else {
                    if (var_o_options.onError) {
                        var_o_options.onError("Status: " + var_o_xhr.status);
                    }
                }
            }
        };

        var var_s_method = var_o_options.method || "GET";
        var_o_xhr.open(var_s_method, var_o_options.url, true);
        
        // Direttiva "Niente Cookie" (come da tua richiesta del 2026-02-16)
        if (var_o_xhr.withCredentials !== undefined) {
            var_o_xhr.withCredentials = false;
        }

        this.log("Inviando richiesta " + var_s_method + " a " + var_o_options.url, "AJAX");
        var_o_xhr.send(var_o_options.data || null);
    };

})(window);
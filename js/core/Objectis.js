/**
 * @file Objectis.js
 * @description Core Framework - Gestione Log semplificata.
 * @version 1.4.8
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.4.8",
        var_b_isBooting: false,
        var_b_isReady: false
    };
}

window.Objectis.init = function() {
    if (this.var_b_isReady) return;
    if (typeof this.scan !== "function" && !this.var_b_isBooting) {
        this.var_b_isBooting = true;
        this.importModule("js/core/Dom.js");
        this.importModule("js/core/DomScanner.js");
        this.importModule("js/core/Ajax.js");
        return;
    }
    if (typeof this.scan === "function") {
        this.var_b_isReady = true;
        this.scan();
        this.setEvents();
    }
};

window.Objectis.log = function(var_s_msg, var_s_type) {
    var var_s_prefix = var_s_type ? "[" + var_s_type + "] " : "";
    var var_o_cont = document.getElementById("system-log-container");
    
    if (var_o_cont) {
        var var_o_div = document.createElement("div");
        var_o_div.innerHTML = "<strong>" + var_s_prefix + "</strong> " + var_s_msg;
        var_o_cont.appendChild(var_o_div);
        
        var var_o_slider = this.var_a_components["console-slider"];
        if (var_o_slider) {
            var var_n_max = Math.max(0, var_o_cont.scrollHeight - var_o_cont.offsetHeight);
            var_o_slider.maxRange = var_n_max;
            var_o_slider.refresh();
            var_o_slider.setValue(var_n_max);
        }
        // Fallback se lo slider non è ancora caricato
        var_o_cont.scrollTop = var_o_cont.scrollHeight;
    }
};

window.Objectis.setEvents = function() {
    var var_o_self = this;
    // Il pulsante di test è l'unico evento che il core gestisce direttamente
    setTimeout(function() {
        var var_o_btn = var_o_self.var_a_components["btn-test-log"];
        if (var_o_btn) {
            var_o_btn.onComponentClick = function() {
                var_o_self.log("Generazione log manuale...", "USER");
            };
        }
    }, 500); // Piccolo delay per attendere il caricamento dei moduli UI
};

window.Objectis.importModule = function(var_s_path) {
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    var_o_script.src = var_s_path;
    document.getElementsByTagName("head")[0].appendChild(var_o_script);
};

window.Objectis.init();
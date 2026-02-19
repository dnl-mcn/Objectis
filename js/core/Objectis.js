/**
 * @file Objectis.js
 * @description Core Framework - Fix per compatibilità JScript/IE.
 * @version 1.4.9
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.4.9",
        var_b_isBooting: false,
        var_b_isReady: false
    };
}

window.Objectis.init = function() {
    var var_o_self = this;
    if (this.var_b_isReady) return;

    // Se lo scanner non è ancora caricato, carichiamo le dipendenze
    if (typeof this.scan !== "function") {
        if (!this.var_b_isBooting) {
            this.var_b_isBooting = true;
            this.importModule("js/core/Dom.js");
            this.importModule("js/core/DomScanner.js");
            this.importModule("js/core/Ajax.js");
        }
        
        // In IE, il caricamento dei tag script può essere asincrono ma non deterministico.
        // Usiamo un polling leggero se lo scanner non appare subito.
        setTimeout(function() { var_o_self.init(); }, 100);
        return;
    }

    this.var_b_isReady = true;
    this.scan();
    this.setEvents();
    this.log("Objectis Core Ready su IE", "SYSTEM");
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
        var_o_cont.scrollTop = var_o_cont.scrollHeight;
    }
};

window.Objectis.setEvents = function() {
    var var_o_self = this;
    // Timeout per dare tempo ai moduli UI caricati via scanner di registrarsi
    setTimeout(function() {
        var var_o_btn = var_o_self.var_a_components["btn-test-log"];
        if (var_o_btn) {
            var_o_btn.onComponentClick = function() {
                var_o_self.log("Interazione confermata.", "UI");
            };
        }
    }, 500);
};

window.Objectis.importModule = function(var_s_path) {
    var var_o_head = document.getElementsByTagName("head")[0];
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    // Aggiungiamo un timestamp per evitare la cache aggressiva di IE
    var_o_script.src = var_s_path + "?v=" + Math.random();
    var_o_head.appendChild(var_o_script);
};

// Punto di ingresso sicuro per IE
(function() {
    if (window.attachEvent) {
        window.attachEvent("onload", function() { window.Objectis.init(); });
    } else {
        window.addEventListener("load", function() { window.Objectis.init(); }, false);
    }
})();